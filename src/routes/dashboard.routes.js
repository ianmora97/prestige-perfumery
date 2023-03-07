const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();


router.get('/admin/main', isAuthenticated, (req, res) => {
    getRole(req).then((rol) => {
        res.render('dashboard/index', {layout: 'dashboard', title: 'Panel', menuItem: 'panel', rol: rol});
    });
});

router.get('/admin/productos', isAuthenticated, (req, res) => {
    getRole(req).then((rol) => {
        res.render('dashboard/productos', {layout: 'dashboard', title: 'Productos', menuItem: 'productos', rol: rol});
    });
});

router.get('/admin/pedidos', isAuthenticated, (req, res) => {
    getRole(req).then((rol) => {
        res.render('dashboard/pedidos', {layout: 'dashboard', title: 'Pedidos', menuItem: 'pedidos', rol:rol});
    });
});

router.get('/admin/clientes', isAuthenticated, (req, res) => {
    getRole(req).then((rol) => {
        res.render('dashboard/clientes', {layout: 'dashboard', title: 'Clientes', menuItem: 'clientes', rol:rol});
    });
});

router.get('/admin/proveedores', isAuthenticated, (req, res) => {
    getRole(req).then((rol) => {
        res.render('dashboard/proveedores', {layout: 'dashboard', title: 'Proveedores', menuItem: 'proveedores', rol:rol});
    });
});

router.get('/admin/reportes', isAuthenticated, (req, res) => {
    getRole(req).then((rol) => {
        res.render('dashboard/reportes', {layout: 'dashboard', title: 'Reportes', menuItem: 'reportes', rol:rol});
    });
});
router.get('/admin/administrador', isAuthenticated, (req, res) => {
    getRole(req).then((rol) => {
        if(rol >= 4){
            res.render('dashboard/administrador', {layout: 'dashboard', title: 'Administrador', menuItem: 'administrador', rol:rol});
        }else{
            res.redirect('/admin/main');
        }
    });
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
function getRole(req){
    return new Promise((resolve, reject) => {
        let headers = req.headers['cookie'] || req.headers['authorization'];
        if(headers === undefined){
            resolve("noRole")
        }else{
            let tokenName = headers.split(";").filter((item) => item.includes("token="))[0];
            if(tokenName === undefined) resolve("noRole")
            else tokenName = tokenName.split("=")[1];
            if(tokenName === undefined){
                resolve("noRole")
            }else{
                jwt.verify(tokenName, process.env.SECRET_KEY, (err, decoded) => {
                    if (err) {
                        resolve("noRole")
                    } else {
                        resolve(decoded.rol);
                    }
                });
            }
        }
    });
}

module.exports = router;