const Purchase = require('../models/purchase.model');
const Product = require('../models/product.model');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = {
    getAll: (req, res) => {
        Purchase.getAll((result) => {
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
    createAdmin: (req, res) => {
        req.body.productos.forEach((item) => {
            Product.remove1Stock({id: item.product, cantidad: item.cantidad}, (result) => {
                if(result.status === 200){
                    who(req).then((user) => {
                        logger.activity(`Stock del producto "${item.product}" actualizado`, user);
                    });
                }
            });
        });
        Purchase.create(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Orden Generada ${req.body.id} creada`, user);
            });
            res.status(result.status).json(result);
        });
    },
    update: (req, res) => {
        Purchase.update(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Compra ${req.body.id} actualizada`, user);
            });
            res.status(result.status).json(result);
        });
    },
    updateStatus: (req, res) => {
        Purchase.updateStatus(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Estado de la compra ${req.body.id} actualizado`, user);
            });
            res.status(result.status).json(result);
        });
    },
    delete: (req, res) => {
        Purchase.delete(req.body.id, (result) => {
            who(req).then((user) => {
                logger.activity(`Compra ${req.body.id} eliminada`, user);
            });
            res.status(result.status).json(result);
        });
    }
}

function who(req) {
    return new Promise((resolve, reject) => {
        let headers = req.headers['cookie'] || req.headers['authorization'];
        if(headers === undefined){
            resolve("Unknown");
        }else{
            let tokenName = headers.split(";").filter((item) => item.includes("token="))[0];
            if(tokenName === undefined) resolve("Unknown");
            else tokenName = tokenName.split("=")[1];
            jwt.verify(tokenName, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    console.log(err);
                    resolve("Unknown");
                } else {
                    resolve(decoded.user);
                }
            });
        }
    });
}