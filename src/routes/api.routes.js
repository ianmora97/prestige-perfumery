const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();

/**
 * CRUD for User
 */
const USER = require('../controllers/user.controller');
router.get('/api/user/all', isAuthenticated, USER.getAll);
router.post('/api/user/add', isAuthenticated, USER.create);
/**
 * CRUD for Products
 */
const PRODUCT = require('../controllers/product.controller');
router.get('/api/product/all', PRODUCT.getAll); // No authentication required
router.get('/api/product/all/selectize',isAuthenticated, PRODUCT.getProducts);
router.get('/api/product/all/productslow',isAuthenticated, PRODUCT.getProductsInStock);
router.get('/api/product/one/:id', isAuthenticated, PRODUCT.findOne);
router.post('/api/product/add', isAuthenticated, PRODUCT.create);
router.put('/api/product/update', isAuthenticated, PRODUCT.update);
router.put('/api/product/stock', isAuthenticated, PRODUCT.updateStock);
router.delete('/api/product/delete', isAuthenticated, PRODUCT.delete);
/**
 * CRUD for Bodega
 */
const BODEGA = require('../controllers/bodega.controller');
router.get('/api/bodega/all', isAuthenticated, BODEGA.getAll);
router.post('/api/bodega/add', isAuthenticated, BODEGA.create);
router.put('/api/bodega/update', isAuthenticated, BODEGA.update);
router.delete('/api/bodega/delete', isAuthenticated, BODEGA.delete);
/**
 * CRUD for Purchase
*/
const PURCHASE = require('../controllers/purchase.controller');
router.get('/api/purchase/all', isAuthenticated, PURCHASE.getAll);
router.get('/api/purchase/all/recibidos', isAuthenticated, PURCHASE.recibidos);
router.get('/api/purchase/all/lastmonth', isAuthenticated, PURCHASE.lastMonth);
router.get('/api/purchase/all/betterclients',isAuthenticated, PURCHASE.betterClients);
router.get('/api/purchase/all/:id', isAuthenticated, PURCHASE.findOne);
router.post('/api/purchase/add', isAuthenticated, PURCHASE.createAdmin);
router.post('/api/purchase/add/client', PURCHASE.createAdmin);
router.put('/api/purchase/update', isAuthenticated, PURCHASE.update);
router.post('/api/purchase/status/update', isAuthenticated, PURCHASE.updateStatus);
router.delete('/api/purchase/delete', isAuthenticated, PURCHASE.delete);
/**
 * CRUD for Cliente
*/
const CLIENTE = require('../controllers/cliente.controller');
router.get('/api/cliente/all', isAuthenticated, CLIENTE.getAll);
router.get('/api/cliente/all/:id', isAuthenticated, CLIENTE.findOne);
router.post('/api/cliente/add', isAuthenticated, CLIENTE.create);
router.put('/api/cliente/update', isAuthenticated, CLIENTE.update);
router.delete('/api/cliente/delete', isAuthenticated, CLIENTE.delete);
/**
 * CRUD for Report 
*/
const REPORT = require('../controllers/report.controller');
router.get('/api/report/all', isAuthenticated, REPORT.getAll);
router.get('/api/report/allclient', isAuthenticated, REPORT.getAllJoin);
router.get('/api/report/allthisyear', isAuthenticated, REPORT.getAllFromThisYear);
router.get('/api/report/getallsixmonths', REPORT.getAll6Months);
router.get('/api/report/all/:id', isAuthenticated, REPORT.findOne);
router.post('/api/report/add', isAuthenticated, REPORT.create);
router.put('/api/report/update', isAuthenticated, REPORT.update);
router.delete('/api/report/delete', isAuthenticated, REPORT.delete);

function isAuthenticated(req, res, next) {
    let headers = req.headers['cookie'] || req.headers['authorization'];
    if(headers === undefined){
        res.redirect('/');
    }else{
        let tokenName = headers.split(";").filter((item) => item.includes("token="))[0];
        if(tokenName === undefined) res.redirect('/');
        else tokenName = tokenName.split("=")[1];
        jwt.verify(tokenName, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log(err);
                res.redirect('/');
            } else {
                if(decoded.rol >= 3 ){
                    next();
                }else{
                    res.redirect('/');
                }
            }
        });
    }
}

module.exports = router;