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

router.get('/admin/pedidos', isAuthenticated, (req, res) => {
    res.render('dashboard/pedidos', {layout: 'dashboard', title: 'Pedidos', menuItem: 'pedidos'});
});

router.get('/admin/clientes', isAuthenticated, (req, res) => {
    res.render('dashboard/clientes', {layout: 'dashboard', title: 'Clientes', menuItem: 'clientes'});
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