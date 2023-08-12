const db = require('../database/sqlitecon');
const { DataTypes, Sequelize, QueryTypes } = require('sequelize');

const Analytics = db.define('analytics', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    device: {
        type: DataTypes.STRING,
        allowNull: false
    },
    os: {
        type: DataTypes.STRING,
        allowNull: false
    },
    browser: {
        type: DataTypes.STRING,
        allowNull: false
    },
},{
    timestamps: false,
    freezeTableName: true 
});

exports.getAll = (callback) => {
    Analytics.findAll().then((result) => {
        callback({
            status: 200,
            data: result
        });
    }).catch((err) => {
        callback({
            status: 500,
            data: err
        });
    });
}

// get count of each device, os, and browser used to access the site
exports.getAnalytics = (callback) => {
    db.query('SELECT device, COUNT(device) AS count FROM analytics GROUP BY device UNION SELECT os, COUNT(os) AS count FROM analytics GROUP BY os UNION SELECT browser, COUNT(browser) AS count FROM analytics GROUP BY browser', {
        type: QueryTypes.SELECT
    }).then((result) => {
        callback({
            status: 200,
            data: result
        });
    }).catch((err) => {
        callback({
            status: 500,
            data: err
        });
    });
}
exports.findOne = (id, callback) => {
    Analytics.findOne({
        where: {
            id: id
        }
    }).then((result) => {
        callback({
            status: 200,
            data: result
        });
    }).catch((err) => {
        callback({
            status: 500,
            data: err
        });
    });
}
exports.create = (data, callback) => {
    Analytics.create({
        ip: data.ip,
        url: data.url,
        date: data.date,
        device: data.device,
        os: data.os,
        browser: data.browser
    }).then((result) => {
        callback({
            status: 200,
            data: result
        });
    }).catch(err => {
        callback({
            status: 500,
            data: err
        });
    });
}
exports.destroy = (callback) => {
    Analytics.destroy({
        where: {},
        truncate: true
    }).then((result) => {
        callback({
            status: 200,
            data: result
        });
    }).catch(err => {
        callback({
            status: 500,
            data: err
        });
    });
}