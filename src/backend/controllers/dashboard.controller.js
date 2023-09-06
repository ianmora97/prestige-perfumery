const Dashboard = require('../models/dashboard.schema');
require("dotenv").config();


module.exports = {
    get: (req, res) => {
        Dashboard.get((result) => {
            res.status(result.status).json(result.data);
        });
    },
    getOne: (req, res) => {
        const { name } = req.params;
        Dashboard.getOne(name, (result) => {
            res.status(result.status).json(result.data);
        });
    },
    create: (req, res) => {
        Dashboard.create(req.body, (result) => {
            res.status(result.status).json(result.data);
        });
    },
    update: (req, res) => {
        const { id } = req.params;
        Dashboard.update(id, req.body, (result) => {
            res.status(result.status).json(result.data);
        });
    }
}
