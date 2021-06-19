var mysql = require('mysql');
const chalk = require('chalk');
require('dotenv').config();

var config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    dateStrings: true
};

var db = mysql.createPool(config);

db.getConnection(function(err) {
    if (err){
        console.log(err);
        return;
    }else{
        console.log('[',chalk.bgMagenta('OK'),'] Database', chalk.green(`${process.env.DB_DATABASE}`),'conected');
    }
});
module.exports = db;