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
    if (req.secure) {
        return next();
    }
    return res.redirect(`https://${req.headers.host}${req.url}`);
}

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