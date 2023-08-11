const mysqlcon = require('../database/mysqlcon');
const { DataTypes, Op, QueryTypes } = require('sequelize');

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
    type:{
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
    },
    barcode:{
        type: DataTypes.STRING,
        allowNull: false
    },
    rating:{
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 5
    }
}, {
    freezeTableName: true,
    timestamps: false
});

exports.getAll = async (resolve) => {
    Product.findAll()
    .then((products) => {
        resolve({
            status: 200,
            data: products
        });
    }, (error) => {
        resolve({
            status: 500,
            data: error
        });
    });
}
exports.getAllQuery = async (data, resolve) => {
    Product.findAll({
        where: {
            category: {
                [Op.like]: '%' + data.category + '%'
            },
            brand: {
                [Op.like]: '%' + data.brand + '%'
            },
            [Op.and]: [
                { stock: { [Op.gt]: 0 } },
            ]
        },
        offset: data.offset,
        limit: data.limit,
    }).then((products) => {
        resolve({
            status: 200,
            data: products
        });
    }).catch((error) => {
        console.log(error);
        resolve({
            status: 500,
            data: error
        });
    });
}
exports.getAllQuerySearch = async (data, resolve) => {
    Product.findAll({
        where: {
            [Op.or]: [
                {category: {
                    [Op.like]: '%' + data.search + '%'
                }},
                {brand: {
                    [Op.like]: '%' + data.search + '%'
                }},
                {name: {
                    [Op.like]: '%' + data.search + '%'
                }},
            ],
            [Op.and]: [
                { stock: { [Op.gt]: 0 } },
            ]
        },
        offset: data.offset,
        limit: data.limit,
    }).then((products) => {
        resolve({
            status: 200,
            data: products
        });
    }).catch((error) => {
        console.log(error);
        resolve({
            status: 500,
            data: error
        });
    });
}
exports.count = async (resolve) => {
    Product.count()
    .then((count) => {
        resolve({
            status: 200,
            data: count
        });
    }).catch((error) => {
        resolve({
            status: 500,
            data: error
        });
    });
}
exports.getProductsPagination = async (data, resolve) => {
    Product.findAll({
        offset: data.offset,
        limit: data.limit,
    }).then((products) => {
        Product.count()
        .then((count) => {
            resolve({
                status: 200,
                data: {
                    products: products,
                    count: count
                },
            });
        }).catch((error) => {
            resolve({
                status: 500,
                data: error
            });
        });
    }, (error) => {
        resolve({
            status: 500,
            data: error
        });
    });
};
exports.findOne = async (id, resolve) => {
    Product.findOne({
        where: {
            id: parseInt(id)
        }
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
};
exports.findOneuuid = async (uuid, resolve) => {
    Product.findOne({
        where: {
            uuid: uuid
        }
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
};
exports.getProducts = async (resolve) => {
    Product.findAll({
        where: {
            stock: {
                [Op.gte]: 1
            }
        },
        attributes: ['id', 'name', 'brand', 'stock', 'category', 'price']
    }).then((products) => {
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
// get all products that are in stock (whene notification is greater than stock)
exports.getProductsInStock = async (resolve) => {
    Product.findAll({
        where: {
            notification: {
                [Op.gte]: mysqlcon.literal('stock')
            }
        }
    }).then((products) => {
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

/**
 * Creates a new product
 */
exports.create = async (body, resolve) => {
    Product.create({
        code: body.code,
        uuid: body.uuid,
        name: body.name,
        brand: body.brand,
        type: body.type,
        category: body.category,
        price: body.price,
        image: body.filename,
        stock: body.stock,
        notification: body.notification,
        promotion: body.promotion,
        cantidad: body.cantidad,
        barcode: body.barcode
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
};

exports.update = async (body, resolve) => {
    Product.update({
        name: body.name,
        brand: body.brand,
        type: body.type,
        category: body.category,
        price: body.price,
        image: body.filename,
        stock: body.stock,
        notification: body.notification,
        promotion: body.promotion,
        cantidad: body.cantidad,
        barcode: body.barcode
    }, {
        where: {
            id: body.id
        }
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
exports.getRating = async (id, resolve) => {
    Product.findOne({
        where: {
            id: id
        },
        attributes: ['rating']
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
exports.updateRating = async (body, resolve) => {
    Product.update({
        rating: body.rating
    }, {
        where: {
            id: body.id
        }
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
exports.remove1Stock = async (body, resolve) => {
    Product.update({
        stock: mysqlcon.literal(`stock - ${body.cantidad}`)
    }, {
        where: {
            id: body.id
        }
    }).then((product) => {
        resolve({
            status: 200,
            data: product
        });
    }).catch((error) => {
        console.log(error);
        resolve({
            status: 500,
            data: error
        });
    });
}
exports.add1Stock = async (body, resolve) => {
    Product.update({
        stock: mysqlcon.literal(`stock + ${body.cantidad}`)
    }, {
        where: {
            id: body.id
        }
    }).then((product) => {
        resolve({
            status: 200,
            data: product
        });
    }).catch((error) => {
        console.log(error);
        resolve({
            status: 500,
            data: error
        });
    });
}
exports.updateStock = async (body, resolve) => {
    Product.update({
        stock: body.stock
    }, {
        where: {
            uuid: body.uuid
        }
    }).then((product) => {
        resolve({
            status: 200,
            data: product
        });
    }).catch((error) => {
        console.log(error);
        resolve({
            status: 500,
            data: error
        });
    });
}

exports.delete = async (body, resolve) => {
    Product.destroy({
        where: {
            id: body.id
        }
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