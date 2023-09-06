const Purchase = require('../models/purchase.model');
const Product = require('../models/product.model');
const Report = require('../models/report.model');
const { checkProducto, checkProductoUUID } = require('../helpers/checkStock');
require("dotenv").config();

module.exports = {
    getAll: (req, res) => {
        Purchase.getAll((result) => {
            res.status(result.status).json(result.data);
        });
    },
    betterClients: (req, res) => {
        Purchase.betterClients((result) => {
            res.status(result.status).json(result.data);
        });
    },
    findOne: (req, res) => {
        Purchase.findOne(req.params.id, (result) => {
            res.status(result.status).json(result.data);
        });
    },
    recibidos: (req, res) => {
        Purchase.recibidos((result) => {
            res.status(result.status).json(result.data);
        });
    },
    lastMonth: (req, res) => {
        Purchase.lastMonth((result) => {
            res.status(result.status).json(result.data);
        });
    },
    createAdmin: (req, res) => {
        req.body.productos.forEach((item) => {
            Product.remove1Stock({id: item.product, cantidad: item.cantidad}, (result) => {
                if(result.status === 200){
                    checkProducto(item.product);
                }
            });
        });
        Report.create(req.body, (result) => {});
        Purchase.create(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    update: (req, res) => {
        Purchase.update(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    updateStatus: (req, res) => {
        Purchase.updateStatus(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    delete: (req, res) => {
        req.body.productos.forEach((item) => {
            Product.add1Stock({id: item.product, cantidad: item.cantidad}, (result) => {
                if(result.status === 200){
                    checkProducto(item.product);
                }
            });
        });
        Purchase.delete(req.body.id, (result) => {
            res.status(result.status).json(result);
        });
    }
}