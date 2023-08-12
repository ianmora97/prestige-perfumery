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
/**
 * 
 * @param {String} act Activity to log ? What is the activity?
 * @param {String} who Who is doing the activity?
 */
function activity(act, who){
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    var log = `${date} | ${act} | by ${who}\n${"----------".repeat(20)}\n`;
    fs.appendFile(path.join(__dirname, '../logs/activity.log'), log + '\n', (err) => {
        if (err) console.log(err);
    });
}

module.exports = {
    error,
    activity,
}