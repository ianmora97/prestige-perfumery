const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();


router.get('/admin/main', isAuthenticated, (req, res) => {
    res.render('dashboard/index', {layout: 'dashboard', title: 'Panel', menuItem: 'panel'});
});

router.get('/admin/productos', isAuthenticated, (req, res) => {
    res.render('dashboard/productos', {layout: 'dashboard', title: 'Productos', menuItem: 'productos'});
});

function isAuthenticated(req, res, next) {
    let headers = req.headers['cookie'] || req.headers['authorization'];
    if(headers === undefined){
        res.redirect('/');
    }else{
        let tokenName = headers.split(";").filter((item) => item.includes("token="))[0];
        if(tokenName === undefined) res.redirect('/');
        else tokenName = tokenName.split("=")[1];
        if(tokenName === undefined){
            res.redirect('/');
        }else{
            jwt.verify(tokenName, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    res.redirect('/');
                } else {
                    next();
                }
            });
        }
    }
}

module.exports = router;