const Product = require('../models/product.model');
const logger = require('../utils/logger');

const { v4: uuidv4 } = require('uuid');

module.exports = {
    getAll: (req, res) => {
        Product.getAll((result) => {
            res.status(result.status).json(result.data);
        });
    },
    create: (req, res) => {
        let code = uuidv4();
        req.body.code = code.split('-')[0];
        req.body.uuid = code;
        Product.create(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    update: (req, res) => {
        Product.update(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    updateStock: (req, res) => {
        Product.updateStock(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    delete: (req, res) => {
        Product.delete(req.body, (result) => {
            res.status(result.status).json(result);
        });
    }
}