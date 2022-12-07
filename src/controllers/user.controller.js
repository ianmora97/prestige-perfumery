const User = require('../models/user.model');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

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
            uuid: uuidv4(),
            name: req.body.name,
            rol: req.body.rol,
            rol_name: req.body.rol_name,
            phone: req.body.phone || null
        };
        User.create(user, (result) => {
            res.status(result.status).json(result.data);
        });
    }
}

