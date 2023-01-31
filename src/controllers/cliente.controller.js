const Cliente = require('../models/cliente.model');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
require("dotenv").config();


module.exports = {
    getAll: (req, res) => {
        if(req.query.type != undefined && req.query.type == "selectize"){
            Cliente.getAllSelectize((result) => {
                res.status(result.status).json(result.data);
            });
        }else{
            Cliente.getAll((result) => {
                res.status(result.status).json(result.data);
            });
        }
    },
    findOne: (req, res) => {
        Cliente.findOne(req.params.id, (result) => {
            res.status(result.status).json(result.data);
        });
    },
    create: (req, res) => {
        Cliente.create(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Cliente "${req.body.nombre}" creado`, user);
            })
            res.status(result.status).json(result);
        });
    },
    update: (req, res) => {
        Cliente.update(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Cliente "${req.body.nombre}" actualizado`, user);
            })
            res.status(result.status).json(result);
        });
    },
    delete: (req, res) => {
        Cliente.delete(req.body.id, (result) => {
            who(req).then((user) => {
                logger.activity(`Cliente "${req.body.id}" eliminado`, user);
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