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
    mysqlcon.query('SELECT t_purchase.*, t_client.nombre, t_client.cedula, t_client.phone, t_client.direction, t_client.email FROM t_purchase LEFT JOIN t_client ON t_purchase.client = t_client.id', {
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
exports.betterClients = (callback) => {
    mysqlcon.query(`SELECT t_purchase.client, COUNT(t_purchase.client) AS total, GROUP_CONCAT(t_purchase.items SEPARATOR '$=$') AS items FROM t_purchase GROUP BY t_purchase.client ORDER BY total DESC LIMIT 10`, {
        type: QueryTypes.SELECT
    }).then((result) => {
        Client.getAll((response) => {
            if(response.status == 200){
                result.forEach((purchase) => {
                    let total = 0;
                    let items = purchase.items.split('$=$');
                    items.forEach((item) => {
                        item = JSON.parse(item);
                        total += item.precio;
                    });
                    purchase.items = items.map((item) => {
                        item = JSON.parse(item);
                        return item;
                    });
                    purchase.totalSpend = total;
                    response.data.forEach((client) => {
                        if(client.id == purchase.client){
                            purchase.client = client.nombre;
                        }
                    });
                });
                callback({
                    status: 200,
                    data: result
                });
            }else{
                callback({
                    status: 500,
                    data: response.data
                });
            }
        });
    }).catch((err) => {
        callback({
            status: 500,
            data: err
        });
    });
    
}
exports.recibidos = (callback) => {
    mysqlcon.query('SELECT t_purchase.*, t_client.nombre FROM t_purchase LEFT JOIN t_client ON t_purchase.client = t_client.id WHERE t_purchase.state = 1', {
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
exports.lastMonth = (callback) => {
    // get all purchases from last month
    mysqlcon.query('SELECT t_purchase.*, t_client.nombre FROM t_purchase LEFT JOIN t_client ON t_purchase.client = t_client.id WHERE MONTH(t_purchase.createdAt) = MONTH(CURRENT_DATE)', {
        type: QueryTypes.SELECT
    }).then((result) => {
        // get all purchases from past month
        mysqlcon.query('SELECT t_purchase.*, t_client.nombre FROM t_purchase LEFT JOIN t_client ON t_purchase.client = t_client.id WHERE MONTH(t_purchase.createdAt) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)', {
            type: QueryTypes.SELECT
        }).then((result2) => {
            callback({
                status: 200,
                data: {
                    lastMonth: result,
                    pastMonth: result2
                }
            });
        }).catch((err) => {
            callback({
                status: 500,
                data: err
            });
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
// mysqlcon.query('SELECT t_purchase.client, COUNT(t_purchase.client) AS total FROM t_purchase GROUP BY t_purchase.client ORDER BY total DESC LIMIT 10', {