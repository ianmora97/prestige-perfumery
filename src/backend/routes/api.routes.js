const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isAuthenticatedAdmin, isAuthenticatedClient } = require('../helpers/auth');
require("dotenv").config();

/**
 * CRUD for User
 */
const USER = require('../controllers/user.controller');
router.get('/api/user/all', isAuthenticatedAdmin, USER.getAll); // ! Authentication required for admin
router.post('/api/user/add', isAuthenticatedAdmin, USER.create); // ! Authentication required for admin
router.put('/api/user/update', isAuthenticatedAdmin, USER.update); // ! Authentication required for admin
router.delete('/api/user/delete', isAuthenticatedAdmin, USER.delete); // ! Authentication required for admin
/**
 * CRUD for Products
 */
const PRODUCT = require('../controllers/product.controller');
router.get('/api/product/all', PRODUCT.getAll); // * No authentication required
router.get('/api/product/count', PRODUCT.count); // * No authentication required
router.get('/api/product/allpagination', PRODUCT.getProductsPagination); // * No authentication required
router.get('/api/product/one/:id', PRODUCT.findOne); // * No authentication required
router.put('/api/product/rating', isAuthenticatedClient, PRODUCT.updateRating); // todo: Authentication required for clients
router.get('/api/product/all/selectize',isAuthenticatedAdmin, PRODUCT.getProducts); // ! Authentication required for admin
router.get('/api/product/all/productslow',isAuthenticatedAdmin, PRODUCT.getProductsInStock); // ! Authentication required for admin
router.post('/api/product/add', isAuthenticatedAdmin, PRODUCT.create); // ! Authentication required for admin
router.put('/api/product/update', isAuthenticatedAdmin, PRODUCT.update); // ! Authentication required for admin
router.put('/api/product/stock', isAuthenticatedAdmin, PRODUCT.updateStock); // ! Authentication required for admin
router.delete('/api/product/delete', isAuthenticatedAdmin, PRODUCT.delete); // ! Authentication required for admin
/**
 * CRUD for Bodega
 */
const BODEGA = require('../controllers/bodega.controller');
router.get('/api/bodega/all', isAuthenticatedAdmin, BODEGA.getAll); // ! Authentication required for admin
router.get('/api/bodega/producto/get', isAuthenticatedAdmin, BODEGA.getBodegaProductobyProducto); // ! Authentication required for admin
router.post('/api/bodega/add', isAuthenticatedAdmin, BODEGA.create); // ! Authentication required for admin
router.post('/api/bodega/producto/add', isAuthenticatedAdmin, BODEGA.createBodegaProducto); // ! Authentication required for admin
router.put('/api/bodega/producto/update', isAuthenticatedAdmin, BODEGA.updateBodegaProducto); // ! Authentication required for admin
router.put('/api/bodega/update', isAuthenticatedAdmin, BODEGA.update); // ! Authentication required for admin
router.delete('/api/bodega/delete', isAuthenticatedAdmin, BODEGA.delete); // ! Authentication required for admin
/**
 * CRUD for Purchase
*/
const PURCHASE = require('../controllers/purchase.controller');
router.post('/api/purchase/add/client', PURCHASE.createAdmin); // * No authentication required
router.get('/api/purchase/all', isAuthenticatedAdmin, PURCHASE.getAll); // ! Authentication required for admin
router.get('/api/purchase/all/recibidos', isAuthenticatedAdmin, PURCHASE.recibidos); // ! Authentication required for admin
router.get('/api/purchase/all/lastmonth',isAuthenticatedAdmin, PURCHASE.lastMonth); // ! Authentication required for admin
router.get('/api/purchase/all/betterclients',isAuthenticatedAdmin, PURCHASE.betterClients); // ! Authentication required for admin
router.get('/api/purchase/all/:id', isAuthenticatedAdmin, PURCHASE.findOne); // ! Authentication required for admin
router.post('/api/purchase/add', isAuthenticatedAdmin, PURCHASE.createAdmin); // ! Authentication required for admin
router.put('/api/purchase/update', isAuthenticatedAdmin, PURCHASE.update); // ! Authentication required for admin
router.post('/api/purchase/status/update', isAuthenticatedAdmin, PURCHASE.updateStatus); // ! Authentication required for admin
router.delete('/api/purchase/delete', isAuthenticatedAdmin, PURCHASE.delete); // ! Authentication required for admin
/**
 * CRUD for Cliente
*/
const CLIENTE = require('../controllers/cliente.controller');
router.get('/api/cliente/all', isAuthenticatedAdmin, CLIENTE.getAll); // ! Authentication required for admin
router.get('/api/cliente/all/:id', isAuthenticatedAdmin, CLIENTE.findOne); // ! Authentication required for admin
router.post('/api/cliente/add', isAuthenticatedAdmin, CLIENTE.create); // ! Authentication required for admin
router.put('/api/cliente/update', isAuthenticatedAdmin, CLIENTE.update); // ! Authentication required for admin
router.delete('/api/cliente/delete', isAuthenticatedAdmin, CLIENTE.delete); // ! Authentication required for admin
/**
 * CRUD for Report 
*/
const REPORT = require('../controllers/report.controller');
router.get('/api/report/all', isAuthenticatedAdmin, REPORT.getAll); // ! Authentication required for admin
router.get('/api/report/allclient', isAuthenticatedAdmin, REPORT.getAllJoin); // ! Authentication required for admin
router.get('/api/report/allthisyear', isAuthenticatedAdmin, REPORT.getAllFromThisYear); // ! Authentication required for admin
router.get('/api/report/getallsixmonths',isAuthenticatedAdmin, REPORT.getAll6Months); // ! Authentication required for admin
router.get('/api/report/all/:id', isAuthenticatedAdmin, REPORT.findOne); // ! Authentication required for admin
router.post('/api/report/add', isAuthenticatedAdmin, REPORT.create); // ! Authentication required for admin
router.put('/api/report/update', isAuthenticatedAdmin, REPORT.update); // ! Authentication required for admin
router.delete('/api/report/delete', isAuthenticatedAdmin, REPORT.delete); // ! Authentication required for admin
/** 
 * CRUD for Proveedor 
*/
const PROVEEDOR = require('../controllers/proveedor.controller');
router.get('/api/proveedor/all', isAuthenticatedAdmin, PROVEEDOR.getAll); // ! Authentication required for admin
router.post('/api/proveedor/add', isAuthenticatedAdmin, PROVEEDOR.create); // ! Authentication required for admin
router.put('/api/proveedor/updateestado', isAuthenticatedAdmin, PROVEEDOR.estadoUpdate); // ! Authentication required for admin
router.put('/api/proveedor/update', isAuthenticatedAdmin, PROVEEDOR.update); // ! Authentication required for admin
router.delete('/api/proveedor/delete', isAuthenticatedAdmin, PROVEEDOR.delete); // ! Authentication required for admin
/**
 * CRUD for Analytics 
*/
const ANALYTICS = require('../controllers/analytics.controller');
router.get('/api/analytics/all', ANALYTICS.getAll);
router.get('/api/analytics/getAnalytics', ANALYTICS.getAnalytics);


module.exports = router;