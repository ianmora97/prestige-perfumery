const Proveedor = require('../models/proveedor.model');
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
            res.status(result.status).json(result);
        });
    },
    estadoUpdate: (req, res) => {
        Proveedor.estadoUpdate(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    update: (req, res) => {
        Proveedor.update(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    delete: (req, res) => {
        Proveedor.delete(req.body, (result) => {
            res.status(result.status).json(result);
        });
    }
}