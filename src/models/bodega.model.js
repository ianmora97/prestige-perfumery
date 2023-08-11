const mysqlcon = require('../database/mysqlcon');
const { DataTypes, QueryTypes} = require('sequelize');

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

exports.getBodegaProductobyProducto = async (data,resolve) => {
    mysqlcon.query(`select * from t_bodegaProducto where bodega = :bodega and producto = :producto;`, 
        { 
            replacements: { 
                bodega: parseInt(data.bodega) ,
                producto: parseInt(data.producto)
            },
            type: QueryTypes.SELECT 
        }
    ).then((result) => {
        if(result.length != 0){
            resolve({
                status: 200,
                data: result[0]
            });
        }else{
            resolve({
                status: 200,
                data: {
                    cantidad: 0
                }
            });
        }
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