const mysqlcon = require('../database/mysqlcon');
const { DataTypes, Sequelize, QueryTypes } = require('sequelize');

const Product = mysqlcon.define('t_product',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    uuid:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    brand:{
        type: DataTypes.STRING,
        allowNull: false
    },
    category:{
        type: DataTypes.STRING,
        allowNull: false
    },
    price:{
        type: DataTypes.STRING,
        allowNull: false
    },
    image:{
        type: DataTypes.STRING,
        allowNull: true
    },
    stock:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    notification:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    promotion:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    cantidad:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

exports.getAll = async (resolve) => {
    Product.findAll().then((products) => {
        resolve({
            status: 200,
            data: products
        });
    }).catch((error) => {
        resolve({
            status: 500,
            data: error
        });
    });
};

exports.create = async (body, resolve) => {
    Product.create({
        code: body.code,
        uuid: body.uuid,
        name: body.name,
        brand: body.brand,
        category: body.category,
        price: body.price,
        image: body.filename,
        stock: body.stock,
        notification: body.notification,
        promotion: body.promotion,
        cantidad: body.cantidad
    }).then((product) => {
        resolve({
            status: 200,
            data: product
        });
    }).catch((error) => {
        resolve({
            status: 500,
            data: error
        });
    });
}