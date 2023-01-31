const mysqlcon = require('../database/mysqlcon');
const { DataTypes, Sequelize, QueryTypes } = require('sequelize');
const Client = require('./cliente.model');

const Report = mysqlcon.define('t_report',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    client:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    precio:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    freezeTableName: true
});

exports.getAll = (callback) => {
    Report.findAll().then((result) => {
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
    Report.findOne({
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
exports.getAllFromThisYear = (callback) => {
    mysqlcon.query('SELECT * FROM t_report WHERE YEAR(createdAt) = YEAR(NOW())',
    { type: QueryTypes.SELECT })
    .then((result) => {
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
exports.getAll6Months = (callback) => {
    mysqlcon.query('SELECT SUM(precio) AS total, SUM(cantidad) as cantidad, MONTH(createdAt) AS month FROM t_report WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH) GROUP BY MONTH(createdAt)',
    { type: QueryTypes.SELECT })
    .then((result) => {
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
exports.getAllJoinAllTime = (callback) => {
    // sum all precio and cantidad and get the client name and cedula from t_client with more sales
    mysqlcon.query('SELECT SUM(t_report.precio) AS total, SUM(t_report.cantidad) as cantidad, t_client.nombre, t_client.cedula, t_client.level FROM t_report LEFT JOIN t_client ON t_report.client = t_client.id GROUP BY t_report.client ORDER BY total desc LIMIT 10', 
    { type: QueryTypes.SELECT })
    .then((result) => {
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
exports.getAllJoinCurrentMonth = (callback) => {
    mysqlcon.query('SELECT SUM(t_report.precio) AS total, SUM(t_report.cantidad) as cantidad, t_client.nombre, t_client.cedula, t_client.level FROM t_report LEFT JOIN t_client ON t_report.client = t_client.id WHERE MONTH(t_report.createdAt) = MONTH(CURRENT_DATE) GROUP BY t_report.client ORDER BY total desc LIMIT 10', 
    { type: QueryTypes.SELECT })
    .then((result) => {
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
exports.getAllJoinCurrentYear = (callback) => {
    mysqlcon.query('SELECT SUM(t_report.precio) AS total, SUM(t_report.cantidad) as cantidad, t_client.nombre, t_client.cedula, t_client.level FROM t_report LEFT JOIN t_client ON t_report.client = t_client.id WHERE YEAR(t_report.createdAt) = YEAR(CURRENT_DATE) GROUP BY t_report.client ORDER BY total desc LIMIT 10',
    { type: QueryTypes.SELECT })
    .then((result) => {
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
    Report.create({
        client: data.client,
        precio: data.precio,
        cantidad: data.cantidad
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
exports.update = (id, data, callback) => {
    Report.update(data, {
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
exports.delete = (id, callback) => {
    Report.destroy({
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
