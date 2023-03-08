const express = require('express');
const router = express.Router();
const {isAuthenticatedAdmin, getRole} = require('../helpers/auth');


router.get('/admin/main', isAuthenticatedAdmin, (req, res) => {
    getRole(req).then((rol) => {
        res.render('dashboard/index', {layout: 'dashboard', title: 'Panel', menuItem: 'panel', rol: rol});
    });
});

router.get('/admin/productos', isAuthenticatedAdmin, (req, res) => {
    getRole(req).then((rol) => {
        res.render('dashboard/productos', {layout: 'dashboard', title: 'Productos', menuItem: 'productos', rol: rol});
    });
});

router.get('/admin/pedidos', isAuthenticatedAdmin, (req, res) => {
    getRole(req).then((rol) => {
        res.render('dashboard/pedidos', {layout: 'dashboard', title: 'Pedidos', menuItem: 'pedidos', rol:rol});
    });
});

router.get('/admin/clientes', isAuthenticatedAdmin, (req, res) => {
    getRole(req).then((rol) => {
        res.render('dashboard/clientes', {layout: 'dashboard', title: 'Clientes', menuItem: 'clientes', rol:rol});
    });
});

router.get('/admin/proveedores', isAuthenticatedAdmin, (req, res) => {
    getRole(req).then((rol) => {
        res.render('dashboard/proveedores', {layout: 'dashboard', title: 'Proveedores', menuItem: 'proveedores', rol:rol});
    });
});

router.get('/admin/reportes', isAuthenticatedAdmin, (req, res) => {
    getRole(req).then((rol) => {
        res.render('dashboard/reportes', {layout: 'dashboard', title: 'Reportes', menuItem: 'reportes', rol:rol});
    });
});

router.get('/admin/administrador', isAuthenticatedAdmin, (req, res) => {
    getRole(req).then((rol) => {
        if(rol >= 4){
            res.render('dashboard/administrador', {layout: 'dashboard', title: 'Administrador', menuItem: 'administrador', rol:rol});
        }else{
            res.redirect('/admin/main');
        }
    });
});

module.exports = router;