const express = require('express');
const router = express.Router();
const { isAuthenticatedClient } = require('../helpers/auth');

router.get('/client/productos', isAuthenticatedClient, (req, res) => {
    res.render('client/productos', {layout: 'client', title: 'Productos', menuItem: 'home'});
});



module.exports = router;