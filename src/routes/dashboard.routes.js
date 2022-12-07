const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();


router.get('/admin/main', isAuthenticated, (req, res) => {
    // send parameters to the view
    res.render('dashboard/index', {layout: 'dashboard', title: 'Panel', menuItem: 'panel'});
});

router.get('/admin/productos', isAuthenticated, (req, res) => {
    res.render('dashboard/productos', {layout: 'dashboard', title: 'Productos', menuItem: 'productos'});
});

function isAuthenticated(req, res, next) {
    let token = req.headers['cookie'] || req.headers['authorization'];
    if ( token === undefined ) {
        res.redirect('/');
    } else {
        const tokenName = token.split("=")[1];
        jwt.verify(tokenName, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log(err);
                res.redirect('/');
            } else {
                next();
            }
        });
    }
}

module.exports = router;