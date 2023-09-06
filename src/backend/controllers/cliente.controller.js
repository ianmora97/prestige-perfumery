const Cliente = require('../models/cliente.model');
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
            res.status(result.status).json(result);
        });
    },
    update: (req, res) => {
        Cliente.update(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    delete: (req, res) => {
        Cliente.delete(req.body.id, (result) => {
            res.status(result.status).json(result);
        });
    }
}