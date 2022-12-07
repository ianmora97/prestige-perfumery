const moment = require('moment'); 
const path = require('path');
const fs = require('fs');

function error(err, ip, add = ""){
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    var log = `${date} | ${ip} | ${err}\n${add}\n${"----------".repeat(20)}\n`;
    fs.appendFile(path.join(__dirname, '../logs/errors.log'), log + '\n', (err) => {
        if (err) console.log(err);
    });
}

function activity(act){
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    var log = `${date} | ${act}\n${"----------".repeat(20)}\n`;
    fs.appendFile(path.join(__dirname, '../logs/activity.log'), log + '\n', (err) => {
        if (err) console.log(err);
    });
}

function insert(act, ip){
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    var log = `${date} | ${ip} | ${act}\n${"----------".repeat(20)}\n`;
    fs.appendFile(path.join(__dirname, '../logs/inserts.log'), log + '\n', (err) => {
        if (err) console.log(err);
    });
}

function deleteLog(act, ip){
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    var log = `${date} | ${ip} | ${act}\n${"----------".repeat(20)}\n`;
    fs.appendFile(path.join(__dirname, '../logs/deletes.log'), log + '\n', (err) => {
        if (err) console.log(err);
    });
}

module.exports = {
    error,
    activity,
    insert,
    deleteLog
}