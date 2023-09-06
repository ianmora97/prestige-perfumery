const User = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
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
            res.status(result.status).json(result)
        });
    },
    update: (req, res) => {
        User.update(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    delete: (req, res) => {
        User.delete(req.body, (result) => {
            res.status(result.status).json(result);
        });
    }
}