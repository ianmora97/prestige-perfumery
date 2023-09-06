const Bodega = require('../models/bodega.model');
require("dotenv").config();

module.exports = {
    getAll: (req, res) => {
        Bodega.getAll((result) => {
            res.status(result.status).json(result.data);
        });
    },
    getBodegaProducto: (req, res) => {
        Bodega.getBodegaProducto((result) => {
            res.status(result.status).json(result.data);
        });
    },
    getBodegaProductobyProducto: (req,res) => {
        Bodega.getBodegaProductobyProducto(req.query,result => {
            res.status(result.status).json(result.data)
        });
    },
    updateBodegaProducto: (req,res) => {
        const {arr} = req.body;
        arr.forEach(item => {
            Bodega.updateBodegaProducto(item, result => {
                // Callback logic, if needed
            });
        });
        res.send('200');
    },
    createBodegaProducto: (req, res) => {
        Bodega.createBodegaProducto(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    create: (req, res) => {
        Bodega.create(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    update: (req, res) => {
        Bodega.update(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    delete: (req, res) => {
        Bodega.delete(req.body.id, (result) => {
            res.status(result.status).json(result);
        });
    }
}