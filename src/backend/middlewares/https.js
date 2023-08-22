const fs = require("fs");
require("dotenv").config();

/**
 * ? Redirects every request to https if it is not already
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Callback} next next object
 * @returns {Object} response object
 */
function toHttps(req, res, next) {
    if (!isSecure(req)) {
        res.redirect(301, `https://${req.headers.host}${req.url}`);
    }else {
        next();
    }
}


/**
 * @param req express http request
 * @returns true if the http request is secure (comes form https)
 */
function isSecure(req) {
    console.log(req.headers)
    if (req.headers['x-forwarded-proto']) {
        return req.headers['x-forwarded-proto'] === 'https';
    }
    console.log(req.secure)
    return req.secure;
};


/**
 * ? Returns the certificate and key for the server
 * @returns {Object} options object
 */
function cert(){
    var certPath = `/etc/letsencrypt/live/${process.env.PAGE}`;
    var options = {
        key: fs.readFileSync(`${certPath}/privkey.pem`),
        cert: fs.readFileSync(`${certPath}/fullchain.pem`)
    };
    return options;
}

module.exports = {
    toHttps,
    cert
}