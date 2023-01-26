const Bodega = require('../models/bodega.model');
const logger = require('../utils/logger');

module.exports = {
    getAll: (req, res) => {
        Bodega.getAll((result) => {
            res.status(result.status).json(result.data);
        });
    },
    create: (req, res) => {
        Bodega.create(req.body, (result) => {
            logger.activity(`Bodega ${req.body.nombre} creada`, who(req));
            res.status(result.status).json(result);
        });
    },
    update: (req, res) => {
        Bodega.update(req.body, (result) => {
            logger.activity(`Bodega ${req.body.nombre} actualizada`, who(req));
            res.status(result.status).json(result);
        });
    },
    delete: (req, res) => {
        Bodega.delete(req.params.id, (result) => {
            logger.activity(`Bodega ${req.params.id} eliminada`, who(req));
            res.status(result.status).json(result);
        });
    }
}

function who(req) {
    let headers = req.headers['cookie'] || req.headers['authorization'];
    if(headers === undefined){
        return "Unknow";
    }else{
        let tokenName = headers.split(";").filter((item) => item.includes("token="))[0];
        if(tokenName === undefined) return "Unknow";
        else tokenName = tokenName.split("=")[1];
        jwt.verify(tokenName, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log(err);
                return "Unknow";
            } else {
                return decoded.user;
            }
        });
    }
}