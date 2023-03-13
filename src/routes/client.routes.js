const express = require('express');
const router = express.Router();
const { isAuthenticatedClient } = require('../helpers/auth');

router.get('/inicio', isAuthenticatedClient, (req, res) => {
    res.render('client/productos', {layout: 'client', title: 'Productos', menuItem: 'home'});
});

router.get('/productos/result', isAuthenticatedClient, (req, res) => {
    res.render('client/result', {layout: 'client', title: 'Productos', menuItem: 'home'});
});

router.get('/termsandconditions', (req, res) => {
    res.render('termsconditions', {layout: 'client', title: 'Terminos y Condiciones', menuItem: 'us'});
});

router.get('/copyrights', (req, res) => {
    res.render('copyright', {layout: 'client', title: 'Copyright', menuItem: 'us'});
});



module.exports = router;