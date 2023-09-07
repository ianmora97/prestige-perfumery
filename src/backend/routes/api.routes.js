const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isAuthenticatedAdmin, isAuthenticatedClient } = require('../helpers/auth');
require("dotenv").config();

/**
 * CRUD for User
 */
const USER = require('../controllers/user.controller');
router.get('/user/all', isAuthenticatedAdmin, USER.getAll); // ! Authentication required for admin
router.post('/user/add', isAuthenticatedAdmin, USER.create); // ! Authentication required for admin
router.put('/user/update', isAuthenticatedAdmin, USER.update); // ! Authentication required for admin
router.delete('/user/delete', isAuthenticatedAdmin, USER.delete); // ! Authentication required for admin
/**
 * CRUD for Products
 */
const PRODUCT = require('../controllers/product.controller');
router.get('/product/all', PRODUCT.getAll); // * No authentication required
router.get('/product/count', PRODUCT.count); // * No authentication required
router.get('/product/allpagination', PRODUCT.getProductsPagination); // * No authentication required
router.get('/product/one/:id', PRODUCT.findOne); // * No authentication required
router.put('/product/rating', isAuthenticatedClient, PRODUCT.updateRating); // todo: Authentication required for clients
router.get('/product/all/selectize',isAuthenticatedAdmin, PRODUCT.getProducts); // ! Authentication required for admin
router.get('/product/all/productslow',isAuthenticatedAdmin, PRODUCT.getProductsInStock); // ! Authentication required for admin
router.post('/product/add', isAuthenticatedAdmin, PRODUCT.create); // ! Authentication required for admin
router.put('/product/update', isAuthenticatedAdmin, PRODUCT.update); // ! Authentication required for admin
router.put('/product/stock', isAuthenticatedAdmin, PRODUCT.updateStock); // ! Authentication required for admin
router.delete('/product/delete', isAuthenticatedAdmin, PRODUCT.delete); // ! Authentication required for admin
/**
 * CRUD for Bodega
 */
const BODEGA = require('../controllers/bodega.controller');
router.get('/bodega/all', isAuthenticatedAdmin, BODEGA.getAll); // ! Authentication required for admin
router.post('/bodega/add', isAuthenticatedAdmin, BODEGA.create); // ! Authentication required for admin
router.put('/bodega/update', isAuthenticatedAdmin, BODEGA.update); // ! Authentication required for admin
router.delete('/bodega/delete', isAuthenticatedAdmin, BODEGA.delete); // ! Authentication required for admin
/**
 * CRUD for Bodega Producto
 */
router.get('/bodegaproducto/all', isAuthenticatedAdmin, BODEGA.getBodegaProducto); // ! Authentication required for admin
router.get('/bodegaproducto/get', isAuthenticatedAdmin, BODEGA.getBodegaProductobyProducto); // ! Authentication required for admin
router.post('/bodegaproducto/add', isAuthenticatedAdmin, BODEGA.createBodegaProducto); // ! Authentication required for admin
router.put('/bodegaproducto/update', isAuthenticatedAdmin, BODEGA.updateBodegaProducto); // ! Authentication required for admin

/**
 * CRUD for Purchase
*/
const PURCHASE = require('../controllers/purchase.controller');
router.post('/purchase/add/client', PURCHASE.createAdmin); // * No authentication required
router.get('/purchase/all', isAuthenticatedAdmin, PURCHASE.getAll); // ! Authentication required for admin
router.get('/purchase/all/recibidos', isAuthenticatedAdmin, PURCHASE.recibidos); // ! Authentication required for admin
router.get('/purchase/all/lastmonth',isAuthenticatedAdmin, PURCHASE.lastMonth); // ! Authentication required for admin
router.get('/purchase/all/betterclients',isAuthenticatedAdmin, PURCHASE.betterClients); // ! Authentication required for admin
router.get('/purchase/all/:id', isAuthenticatedAdmin, PURCHASE.findOne); // ! Authentication required for admin
router.post('/purchase/add', isAuthenticatedAdmin, PURCHASE.createAdmin); // ! Authentication required for admin
router.put('/purchase/update', isAuthenticatedAdmin, PURCHASE.update); // ! Authentication required for admin
router.post('/purchase/status/update', isAuthenticatedAdmin, PURCHASE.updateStatus); // ! Authentication required for admin
router.delete('/purchase/delete', isAuthenticatedAdmin, PURCHASE.delete); // ! Authentication required for admin
/**
 * CRUD for Cliente
*/
const CLIENTE = require('../controllers/cliente.controller');
router.get('/cliente/all', isAuthenticatedAdmin, CLIENTE.getAll); // ! Authentication required for admin
router.get('/cliente/all/:id', isAuthenticatedAdmin, CLIENTE.findOne); // ! Authentication required for admin
router.post('/cliente/add', isAuthenticatedAdmin, CLIENTE.create); // ! Authentication required for admin
router.put('/cliente/update', isAuthenticatedAdmin, CLIENTE.update); // ! Authentication required for admin
router.delete('/cliente/delete', isAuthenticatedAdmin, CLIENTE.delete); // ! Authentication required for admin
/**
 * CRUD for Report 
*/
const REPORT = require('../controllers/report.controller');
router.get('/report/all', isAuthenticatedAdmin, REPORT.getAll); // ! Authentication required for admin
router.get('/report/allclient', isAuthenticatedAdmin, REPORT.getAllJoin); // ! Authentication required for admin
router.get('/report/allthisyear', isAuthenticatedAdmin, REPORT.getAllFromThisYear); // ! Authentication required for admin
router.get('/report/getallsixmonths',isAuthenticatedAdmin, REPORT.getAll6Months); // ! Authentication required for admin
router.get('/report/all/:id', isAuthenticatedAdmin, REPORT.findOne); // ! Authentication required for admin
router.post('/report/add', isAuthenticatedAdmin, REPORT.create); // ! Authentication required for admin
router.put('/report/update', isAuthenticatedAdmin, REPORT.update); // ! Authentication required for admin
router.delete('/report/delete', isAuthenticatedAdmin, REPORT.delete); // ! Authentication required for admin
/** 
 * CRUD for Proveedor 
*/
const PROVEEDOR = require('../controllers/proveedor.controller');
router.get('/proveedor/all', isAuthenticatedAdmin, PROVEEDOR.getAll); // ! Authentication required for admin
router.post('/proveedor/add', isAuthenticatedAdmin, PROVEEDOR.create); // ! Authentication required for admin
router.put('/proveedor/updateestado', isAuthenticatedAdmin, PROVEEDOR.estadoUpdate); // ! Authentication required for admin
router.put('/proveedor/update', isAuthenticatedAdmin, PROVEEDOR.update); // ! Authentication required for admin
router.delete('/proveedor/delete', isAuthenticatedAdmin, PROVEEDOR.delete); // ! Authentication required for admin
/**
 * CRUD for Analytics 
*/
const ANALYTICS = require('../controllers/analytics.controller');
router.get('/analytics/all', ANALYTICS.getAll);
router.get('/analytics/getAnalytics', ANALYTICS.getAnalytics);
/**
 * CRUD for Tipo de Cambio 
*/
router.get('/cambiodolar', PRODUCT.getTipoCambio);
router.post('/cambiodolar',isAuthenticatedAdmin, PRODUCT.updateTipoCambio);
/**
 * CRUD for Dashboard 
*/
// const DASHBOARD = require('../controllers/dashboard.controller');
// router.get('/dashboard/all', DASHBOARD.get); // ! Authentication required for admin
// router.get('/dashboard/one/:name', DASHBOARD.getOne); // ! Authentication required for admin
// router.post('/dashboard/add', DASHBOARD.create); // ! Authentication required for admin
// router.put('/dashboard/update/:id', DASHBOARD.update); // ! Authentication required for admin

module.exports = router;