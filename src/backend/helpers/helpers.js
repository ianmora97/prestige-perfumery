var CryptoJS = require("crypto-js");
require("dotenv").config();
// Encrypt
function encrypt(string) {
    var ciphertext = CryptoJS.AES.encrypt(string, process.env.SECRET_KEY).toString();
    return ciphertext;
}
// Decrypt
function decrypt(string) {
    var bytes  = CryptoJS.AES.decrypt(string, process.env.SECRET_KEY);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

console.log(encrypt("anything"))