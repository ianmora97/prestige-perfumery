const Proveedor = require('../models/proveedor.model');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = {
    getAll: (req, res) => {
        Proveedor.getAll((result) => {
            if(req.query.type != undefined && req.query.type == "onlyActive"){
                result.data = result.data.filter((item) => item.estado == 1);
                res.status(result.status).json(result.data);
            }else{
                res.status(result.status).json(result.data);
            }
        });
    },
    create: (req, res) => {
        Proveedor.create(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Proveedor "${req.body.nombre}" creado`, user);
            });
            res.status(result.status).json(result);
        });
    },
    estadoUpdate: (req, res) => {
        Proveedor.estadoUpdate(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Proveedor "${req.body.id}" actualizado`, user);
            });
            res.status(result.status).json(result);
        });
    },
    update: (req, res) => {
        Proveedor.update(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Proveedor "${req.body.nombre}" actualizado`, user);
            });
            res.status(result.status).json(result);
        });
    },
    delete: (req, res) => {
        Proveedor.delete(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Pedido "${req.body.id}" eliminado`, user);
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