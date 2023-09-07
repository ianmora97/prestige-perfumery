const rfs = require("rotating-file-stream");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

/**
 * ? pad function
 * @param {number} num
 * @returns {string}
 */
const pad = num => (num > 9 ? "" : "0") + num;
/**
 * ? Create a rotating write stream for log files
 * ? for every day
 */
const stream = rfs.createStream(
    (time, index) => {
        if (!time) return "file.log";
        const folder = time.getFullYear() + "-" + pad(time.getMonth() + 1) + "-" + pad(time.getDate());
        return `${folder}/file.log`;
    },{
        size: "10M",
        interval: "1d",
        path: path.join(__dirname, "../logs")
    }
);
/**
 * ? Create a rotating write stream for error log files
 * ? for every day
 */
const errorStream = rfs.createStream(
    (time, index) => {
        if (!time) return "error.log";
        const folder = time.getFullYear() + "-" + pad(time.getMonth() + 1) + "-" + pad(time.getDate());
        return `${folder}/error.log`;
    },{
        size: "10M",
        interval: "1d",
        path: path.join(__dirname, "../logs")
    }
);
/**
 * ? Custom log token for morgan logger
 * @param {Object} req request
 * @param {Object} res response
 * @returns {string} custom log
 */
function customLog(req, res){
    return `${moment().format("YYYY-MM-DD HH:mm:ss")} - ${req.method} ${req.originalUrl} ${res.statusCode} - FROM[${req.ip}]`;
}
/**
 * ? Log errors to error.log file manually
 * @param {String} err error message
 */
function logErrors(err) {
    fs.appendFile(path.join(__dirname, "../logs/error.log"), 
        `${moment().format("YYYY-MM-DD HH:mm:ss")} - ${err} \n\n`,
        (err) => {
            console.log('The "data to append" was appended to file!');
        }
    );
}
/**
 * ? Log errors to error.log file via middleware
 * @param {Object} err object
 * @param {Object} req object
 * @param {Object} res object
 * @param {Object} next object
 */
function logErrorsMiddleware(err,req,res,next) {
    if(err.type == 'LOG_ERROR'){
        fs.appendFileSync(path.join(__dirname, "../logs/error.log"), 
            `${moment().format("YYYY-MM-DD HH:mm:ss")} - ${err.stack} \n`,
        );
    }
    next();
}

module.exports = {
    stream,
    errorStream,
    customLog,
    logErrors,
    logErrorsMiddleware,
};