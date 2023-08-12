const Report = require('../models/report.model');

module.exports = {
    getAll: (req, res) => {
        Report.getAll((result) => {
            res.status(result.status).json(result.data);
        });
    },
    findOne: (req, res) => {
        Report.findOne(req.params.id, (result) => {
            res.status(result.status).json(result.data);
        });
    },
    getAllJoin: (req, res) => {
        if(req.query.time != undefined && req.query.time == "alltime"){
            Report.getAllJoinAllTime((result) => {
                res.status(result.status).json(result.data);
            });
        }else if(req.query.time != undefined && req.query.time == "currentmonth"){
            Report.getAllJoinCurrentMonth((result) => {
                res.status(result.status).json(result.data);
            });
        }else if(req.query.time != undefined && req.query.time == "currentyear"){
            Report.getAllJoinCurrentYear((result) => {
                res.status(result.status).json(result.data);
            });
        }
    },
    getAllFromThisYear: (req, res) => {
        Report.getAllFromThisYear((result) => {
            res.status(result.status).json(result.data);
        });
    },
    getAll6Months: (req, res) => {
        Report.getAll6Months((result) => {
            res.status(result.status).json(result.data);
        });
    },
    create: (req, res) => {
        Report.create(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    update: (req, res) => {
        Report.update(req.body, (result) => {
            res.status(result.status).json(result);
        });
    },
    delete: (req, res) => {
        Report.delete(req.body, (result) => {
            res.status(result.status).json(result);
        });
    }
}