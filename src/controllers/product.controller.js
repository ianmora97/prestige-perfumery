const Product = require('../models/product.model');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const { checkProducto, checkProductoUUID } = require('../helpers/checkStock');
require("dotenv").config();

const { v4: uuidv4 } = require('uuid');

module.exports = {
    getAll: (req, res) => {
        let queryLen = Object.keys(req.query).length;

        if(queryLen > 0){
            let data = {
                offset: parseInt(req.query.offset) || 0,
                limit: parseInt(req.query.limit) || 10,
                category: req.query.category || "",
                brand: req.query.brand || "" 
            };
            Product.getAllQuery(data,(result) => {
                res.status(result.status).json(result);
            });
        }else{
            Product.getAll((result) => {
                res.status(result.status).json(result.data);
            });
        }
    },
    getProductsPagination: (req, res) => {
        let data = {
            offset: parseInt(req.query.start),
            limit: parseInt(req.query.length)
        };
        Product.getProductsPagination(data,(result) => {
            res.status(result.status).json({
                draw: req.query.draw,
                recordsTotal: result.data.count,
                recordsFiltered: result.data.count,
                data: result.data.products
            });
        });
    },
    count: (req, res) => {
        Product.count((result) => {
            res.status(result.status).json(result.data);
        });
    },
    findOne: (req, res) => {
        Product.findOne(req.params.id, (result) => {
            res.status(result.status).json(result.data);
        });
    },
    findOneuuid: (req, res) => {
        Product.findOneuuid(req.body.uuid, (result) => {
            res.status(result.status).json(result.data);
        });
    },
    getProducts: (req, res) => {
        Product.getProducts((result) => {
            res.status(result.status).json(result.data);
        });
    },
    getProductsInStock: (req, res) => {
        Product.getProductsInStock((result) => {
            res.status(result.status).json(result.data);
        });
    },
    create: (req, res) => {
        let code = uuidv4();
        req.body.code = code.split('-')[0];
        req.body.uuid = code;
        who(req).then((user) => {
            logger.activity(`Producto "${req.body.name}" creado`, user);
        })
        Product.create(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    update: (req, res) => {
        Product.update(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Producto "${req.body.name}" actualizado`, user);
            });
            checkProductoUUID(req.body.uuid);
            res.status(result.status).json(result);
        });
    },
    updateRating: (req, res) => {
        Product.getRating(req.body, (result) => {
            let rating = result.data.rating;
            let newRating = (rating + req.body.rating) / 2;
            Product.updateRating({id: req.body.id, rating: newRating}, (result) => {
                res.status(result.status).json(result);
            });
        });
    },
    updateStock: (req, res) => {
        Product.updateStock(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Cantidad de Producto "${req.body.name}" actualizado`, user);
            });
            checkProductoUUID(req.body.uuid);
            res.status(result.status).json(result);
        });
    },
    delete: (req, res) => {
        Product.delete(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Producto "${req.body.name}" eliminado`, user);
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