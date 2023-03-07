const mysqlcon = require('../database/mysqlcon');
const { DataTypes} = require('sequelize');

const Proveedor = mysqlcon.define('t_dealers', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    estado:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    monto:{
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

exports.getAll = async (resolve) => {
    Proveedor.findAll().then((result) => {
        resolve({
            status: 200,
            data: result
        });
    }).catch((error) => {
        resolve({
            status: 500,
            data: error
        });
    });
}

exports.create = async (data, resolve) => {
    Proveedor.create({
        nombre: data.nombre,
        estado: 1,
        monto: 0,
        cantidad: data.cantidad
    }).then((result) => {
        resolve({
            status: 200,
            data: result
        });
    }).catch((error) => {
        resolve({
            status: 500,
            data: error
        });
    });
}

exports.estadoUpdate = async (data, resolve) => {
    Proveedor.update({
        estado: data.estado
    }, {
        where: {
            id: data.id
        }
    }).then((result) => {
        resolve({
            status: 200,
            data: result
        });
    }).catch((error) => {
        resolve({
            status: 500,
            data: error
        });
    });
}

exports.update = async (data, resolve) => {
    Proveedor.update({
        nombre: data.nombre,
        estado: data.estado,
        monto: 0,
        cantidad: data.cantidad
    }, {
        where: {
            id: data.id
        }
    }).then((result) => {
        resolve({
            status: 200,
            data: result
        });
    }).catch((error) => {
        resolve({
            status: 500,
            data: error
        });
    });
}

exports.delete = async (data, resolve) => {
    Proveedor.destroy({
        where: {
            id: data.id
        }
    }).then((result) => {
        resolve({
            status: 200,
            data: result
        });
    }).catch((error) => {
        resolve({
            status: 500,
            data: error
        });
    });
}