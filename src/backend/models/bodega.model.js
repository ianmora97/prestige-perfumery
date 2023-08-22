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

exports.getBodegaProducto = async (resolve) => {
    BodegaProducto.findAll()
    .then((result) => {
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
exports.getBodegaProductobyProducto = async (data,resolve) => {
    BodegaProducto.findOne({
        where:{
            [Op.and]:[
                {producto: parseInt(data.producto)},
                {bodega: parseInt(data.bodega)},
            ]
        }
    }).then((result) => {
        if(result){
            resolve({
                status: 200,
                data: result
            });
        }else{
            Bodega.findOne({
                where:{
                    id: parseInt(data.bodega),
                },
                attributes: ['id','nombre']
            }).then((result1) => {
                resolve({
                    status: 200,
                    data:{
                        id: result1.id,
                        nombre: result1.nombre,
                        cantidad: 0
                    }
                });
            }).catch((error) => {
                resolve({
                    status: 500,
                    data: error
                });
            });
        }
    }).catch((error) => {
        resolve({
            status: 500,
            data: error
        });
    });
};
exports.updateBodegaProducto = async (data,resolve) => {
    BodegaProducto.findOne({
        where:{
            [Op.and]:[
                {producto: parseInt(data.producto)},
                {bodega: parseInt(data.bodega)},
            ]
        }
    }).then((result) => {
        if(result){
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
        }else{
            const newItemData = {
                cantidad: parseInt(data.cantidad),
                producto: parseInt(data.producto),
                bodega: parseInt(data.bodega)
            };
            BodegaProducto.create(newItemData)
            .then(result => {
                // Item creation successful
                resolve({
                    status: 201, // 201 Created status code
                    data: result
                });
            })
            .catch(error => {
                // Item creation failed
                resolve({
                    status: 500, // 500 Internal Server Error status code
                    data: error
                });
            });
        }
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