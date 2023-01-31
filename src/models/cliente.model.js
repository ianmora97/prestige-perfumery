const mysqlcon = require('../database/mysqlcon');
const { DataTypes, Sequelize, QueryTypes } = require('sequelize');

const Cliente = mysqlcon.define('t_client',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    level:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    cedula:{
        type: DataTypes.STRING,
        allowNull: false
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: true
    },
    direction:{
        type: DataTypes.STRING,
        allowNull: true
    },
    email:{
        type: DataTypes.STRING,
        allowNull: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    freezeTableName: true
});

exports.getAll = (callback) => {
    Cliente.findAll().then((result) => {
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
exports.getAllSelectize = (callback) => {
    Cliente.findAll({
        attributes: ['id', 'nombre', 'cedula']
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
    Cliente.findOne({
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
    Cliente.create({
        level: data.level,
        nombre: data.nombre,
        cedula: data.cedula,
        phone: data.phone,
        direction: data.direction,
        email: data.email,
        password: data.password
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
    Cliente.update({
        level: data.level,
        nombre: data.nombre,
        cedula: data.cedula,
        phone: data.phone,
        direction: data.direction,
        email: data.email,
        password: data.password
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
    Cliente.destroy({
        where: {
            id: id
        }
    }).then((result) => {
        callback({
            status: 200,
            data: result
        });
    }).catch((err) => {
        console.log(err);
        callback({
            status: 500,
            data: err
        });
    });
}