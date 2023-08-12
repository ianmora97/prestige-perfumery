const mysqlcon = require('../database/mysqlcon');
const { DataTypes, QueryTypes, Op} = require('sequelize');

const Bodega = mysqlcon.define('t_bodega',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ubicacion:{
        type: DataTypes.STRING,
        allowNull: true
    },
    extra:{
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    timestamps: false,
    freezeTableName: true,
});
const BodegaProducto = mysqlcon.define('t_bodegaProducto',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    producto:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bodega:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    timestamps: false,
    freezeTableName: true,
});

exports.getBodegaProductobyProducto = async (data,resolve) => {
    BodegaProducto.findOne({
        where:{
            [Op.and]:[
                {producto: parseInt(data.producto)},
                {bodega: parseInt(data.bodega)},
            ]
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
};
exports.updateBodegaProducto = async (data,resolve) => {
    BodegaProducto.update({ cantidad: parseInt(data.cantidad) }, {
        where: {
            [Op.and]:[
                {producto: parseInt(data.producto)},
                {bodega: parseInt(data.bodega)},
            ]
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
};
exports.createBodegaProducto = async (data,resolve) => {
    BodegaProducto.bulkCreate(data.arr).then((result) => {
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
};
exports.getAll = async (resolve) => {
    Bodega.findAll().then((result) => {
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
};

exports.create = async (data, resolve) => {
    Bodega.create({
        nombre: data.nombre,
        ubicacion: data.ubicacion,
        extra: data.extra
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
    Bodega.update({
        nombre: data.nombre,
        ubicacion: data.ubicacion,
        extra: data.extra
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

exports.delete = async (id, resolve) => {
    Bodega.destroy({
        where: {
            id: id
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