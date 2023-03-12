const express = require('express');
const router = express.Router();
const { isAuthenticatedClient } = require('../helpers/auth');

router.get('/inicio', isAuthenticatedClient, (req, res) => {
    res.render('client/productos', {layout: 'client', title: 'Productos', menuItem: 'home'});
});
router.get('/carrito', isAuthenticatedClient, (req, res) => {
    res.render('client/carrito', {layout: 'client', title: 'Carrito de Compra', menuItem: 'carrito'});
});



module.exports = router;