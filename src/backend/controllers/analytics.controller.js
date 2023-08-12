const Analytics = require('../models/analytics.model');

module.exports = {
    getAll: (req, res) => {
        Analytics.getAll((result) => {
            res.status(result.status).json(result.data);
        });
    },
    getAnalytics: (req, res) => {
        Analytics.getAnalytics((result) => {
            res.status(result.status).json(result.data);
        });
    }
}