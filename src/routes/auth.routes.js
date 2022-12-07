const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    if (username === 'admin' && password === 'admin12345678') {
        const token = jwt.sign({ username }, process.env.SECRET_KEY, {
            expiresIn: 60 * 60 * 24
        });
        res.json({ auth: true, token });
    } else {
        res.status(401).json({ auth: false, token: null });
    }
});

function isAuthenticated(req, res, next) {
    let token = req.headers['cookie'] || req.headers['authorization'];
    console.log(token);
    if ( token === undefined ) {
        res.redirect('/');
    } else {
        const tokenName = token.split("=")[1];
        jwt.verify(tokenName, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                res.redirect('/');
            } else {
                if(decoded.auth >= 2){
                    req.verified = true;
                    req.decodedToken = decoded;
                    next();
                }else{
                    res.redirect('/');
                }
            }
        });
    }
}

module.exports = router;