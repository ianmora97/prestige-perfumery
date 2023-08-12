const Analytics = require('../models/analytics.model');
const moment = require('moment');
const axios = require('axios');

function destroyAnalytics(){
    return new Promise((resolve, reject) => {
        Analytics.destroy((result) => {
            resolve(result);
        });
    });
}
async function logAnalytics(req, res, next){ // <- Middleware
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let url = req.url;
    let date = moment().format('YYYY-MM-DD HH:mm:ss');
    let userAgent = req.headers['user-agent'];
    let device = await getDevice(userAgent);
    let os = await getOS(userAgent);
    let browser = await getBrowser(userAgent);
    getIPInfo(ip)
    .then(ipInfo => {
        let ipData = JSON.stringify({
            ip: ip,
            country: ipInfo.country || 'Unknown',
            region: ipInfo.regionName || 'Unknown',
            city: ipInfo.city || 'Unknown',
            zip: ipInfo.zip || 'Unknown',
            timezone: ipInfo.timezone || 'Unknown'
        });
        let data = {
            ip: ipData,
            url: url,
            date: date,
            device: device,
            os: os,
            browser: browser
        }
        Analytics.create(data, (result) => {
            next();
        });
    }).catch(err => {
        console.log(err);
        next();
    });
}
function getDevice(userAgent){
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)){
        return 'Mobile';
    }else{
        return 'Desktop';
    }
}
function getOS(userAgent){
    if(/Windows/i.test(userAgent)){
        return 'Windows';
    }else if(/Mac/i.test(userAgent)){
        return 'Mac';
    }else if(/X11/i.test(userAgent)){
        return 'UNIX';
    }else if(/Linux/i.test(userAgent)){
        return 'Linux';
    }else if(/iPhone/i.test(userAgent)){
        return 'iPhone';
    }else if(/Android/i.test(userAgent)){
        return 'Android';
    }else{
        return 'Other';
    }
}
function getBrowser(userAgent){
    if(/Chrome/i.test(userAgent)){
        return 'Chrome';
    }else if(/Firefox/i.test(userAgent)){
        return 'Firefox';
    }else if(/Safari/i.test(userAgent)){
        return 'Safari';
    }else if(/Opera/i.test(userAgent)){
        return 'Opera';
    }else if(/MSIE/i.test(userAgent)){
        return 'IE';
    }else{
        return 'Other';
    }
}

function getIPInfo(ip){
    return new Promise((resolve, reject) => {
        axios.get(`http://ip-api.com/json/${ip}`)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            reject(error);
        });
    });
}

module.exports = {
    logAnalytics: logAnalytics,
    destroyAnalytics: destroyAnalytics
};
