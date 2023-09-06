const express = require('express');
const router = express.Router();
const {isAuthenticatedAdmin, roleCheck} = require('../helpers/auth');


router.get('/admin/main', isAuthenticatedAdmin, roleCheck, (req, res) => {
    res.render('dashboard/index', {layout: 'dashboard', title: 'Panel', menuItem: 'panel', rol: req.rol});
});

router.get('/admin/productos', isAuthenticatedAdmin, roleCheck, (req, res) => {
    res.render('dashboard/productos', {layout: 'dashboard', title: 'Productos', menuItem: 'productos', rol: req.rol});
});

router.get('/admin/pedidos', isAuthenticatedAdmin, roleCheck, (req, res) => {
    res.render('dashboard/pedidos', {layout: 'dashboard', title: 'Pedidos', menuItem: 'pedidos', rol:req.rol});
});

router.get('/admin/clientes', isAuthenticatedAdmin, roleCheck, (req, res) => {
    res.render('dashboard/clientes', {layout: 'dashboard', title: 'Clientes', menuItem: 'clientes', rol:req.rol});
});

router.get('/admin/bodegas', isAuthenticatedAdmin, roleCheck, (req, res) => {
    res.render('dashboard/bodegas', {layout: 'dashboard', title: 'Bodegas', menuItem: 'bodegas', rol:req.rol});
});

router.get('/admin/proveedores', isAuthenticatedAdmin, roleCheck, (req, res) => {
    res.render('dashboard/proveedores', {layout: 'dashboard', title: 'Proveedores', menuItem: 'proveedores', rol:req.rol});
});

router.get('/admin/reportes', isAuthenticatedAdmin, roleCheck, (req, res) => {
    res.render('dashboard/reportes', {layout: 'dashboard', title: 'Reportes', menuItem: 'reportes', rol:req.rol});
});

router.get('/admin/administrador', isAuthenticatedAdmin, roleCheck, (req, res) => {
    if(req.rol >= 4){
        res.render('dashboard/administrador', {layout: 'dashboard', title: 'Administrador', menuItem: 'administrador', rol:req.rol});
    }else{
        res.redirect('/admin/main');
    }
});

router.get("/admin/config", isAuthenticatedAdmin, roleCheck, (req, res) => {
    if(req.rol >= 4){
        res.render('dashboard/config', {layout: 'dashboard', title: 'Configuracion', menuItem: 'config', rol: req.rol});
    }else{
        res.redirect('/admin/main');
    }
});

module.exports = router;