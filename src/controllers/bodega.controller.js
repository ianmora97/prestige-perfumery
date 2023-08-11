const Bodega = require('../models/bodega.model');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = {
    getAll: (req, res) => {
        Bodega.getAll((result) => {
            res.status(result.status).json(result.data);
        });
    },
    getBodegaProductobyProducto: (req,res) => {
        Bodega.getBodegaProductobyProducto(req.query,result => {
            res.status(result.status).json(result.data)
        });
    },
    create: (req, res) => {
        Bodega.create(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Bodega "${req.body.nombre}" creada`, user);
            })
            res.status(result.status).json(result);
        });
    },
    update: (req, res) => {
        Bodega.update(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Bodega actualizada a "${req.body.nombre}"`, user);
            })
            res.status(result.status).json(result);
        });
    },
    delete: (req, res) => {
        Bodega.delete(req.body.id, (result) => {
            who(req).then((user) => {
                logger.activity(`Bodega "${req.body.id}" eliminada`, user);
            })
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