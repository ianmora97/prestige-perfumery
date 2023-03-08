const mysqlcon = require('../database/mysqlcon');
const { DataTypes, Sequelize, QueryTypes } = require('sequelize');
var CryptoJS = require("crypto-js");
var SHA1 = require("crypto-js/sha1");

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
        attributes: ['id', 'nombre', 'cedula', 'level']
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
/**
 * todo: authenticate the client based on the username and password
 * @param {Callback} resolve function to return the result
 */
exports.authenticate = async (username, password, resolve) => {
    mysqlcon.query(
        'CALL authClient(:username, :password)',
        {
            replacements: {
                username: username,
                password: encrypt(password)
            },
            type: QueryTypes.SELECT
        }
    ).then((result) =>{
        resolve({
            status: result[0]['0'].verified == 'true' ? 200 : 401,
            data: {
                verified: result[0]['0'].verified,
                data: result[1]['0']
            }
        });
    })
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
        password: encrypt("123456789")
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
        email: data.email
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
        console.err(err);
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
// Encrypt
function encrypt(string) {
    var hash = SHA1(string);
    return hash.toString();
}
// Decrypt
function decrypt(string) {
    var bytes  = CryptoJS.AES.decrypt(string, process.env.SECRET_KEY);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}