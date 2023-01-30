const mysqlcon = require('../database/mysqlcon');
const { DataTypes, Sequelize, QueryTypes } = require('sequelize');
const Client = require('./cliente.model');

const Purchase = mysqlcon.define('t_purchase',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    client:{
        type: DataTypes.STRING,
        allowNull: true
    },
    state:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    items:{
        type: DataTypes.STRING,
        allowNull: false
    },
    metodoPago:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Efectivo'
    },
    notas:{
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },

},{
    freezeTableName: true
});

exports.getAll = (callback) => {
    mysqlcon.query('SELECT t_purchase.*, t_client.nombre, t_client.cedula, t_client.phone, t_client.direction, t_client.email FROM t_purchase INNER JOIN t_client ON t_purchase.client = t_client.id', {
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
exports.recibidos = (callback) => {
    mysqlcon.query('SELECT t_purchase.*, t_client.nombre FROM t_purchase INNER JOIN t_client ON t_purchase.client = t_client.id WHERE t_purchase.state = 1', {
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
    Purchase.findOne({
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
    Purchase.create({
        client: data.client,
        state: data.state,
        items: data.items,
        metodoPago: data.metodoPago,
        notas: data.notas,
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

exports.update = (data, callback) => {
    Purchase.update({
        client: data.client,
        state: data.state,
        items: data.items,
    },{
        where: {
            id: data.id
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
exports.updateStatus = (data, callback) => {
    Purchase.update({
        state: data.status,
    },{
        where: {
            id: data.id
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
    Purchase.destroy({
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