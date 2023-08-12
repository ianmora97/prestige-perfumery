const User = require('../models/user.model');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = {
    getAll: (req, res) => {
        User.getAll((result) => {
            res.status(result.status).json(result.data);
        });
    },
    create: (req, res) => {
        const code = uuidv4();
        const user = {
            code: code.split('-')[0],
            uuid: code,
            name: req.body.name,
            rol: parseInt(req.body.rol),
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        };
        User.create(user, (result) => {
            who(req).then((user) => {
                logger.activity(`Administrador "${req.body.name}" creado`, user);
            });
            res.status(result.status).json(result)
        });
    },
    update: (req, res) => {
        User.update(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Administrador "${req.body.name}" actualizado`, user);
            });
            res.status(result.status).json(result);
        });
    },
    delete: (req, res) => {
        User.delete(req.body, (result) => {
            who(req).then((user) => {
                logger.activity(`Administrador "${req.body.id}" eliminado`, user);
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
