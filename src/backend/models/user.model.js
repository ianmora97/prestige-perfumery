const mysqlcon = require('../database/mysqlcon');
const { DataTypes, Sequelize, QueryTypes } = require('sequelize');
var CryptoJS = require("crypto-js");
var SHA1 = require("crypto-js/sha1");

require("dotenv").config();

const User = mysqlcon.define('t_user',{
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
    username:{
        type: DataTypes.STRING,
        allowNull: false
    },
    photo:{
        type: DataTypes.STRING,
        allowNull: true
    },
    rol:{
        type: DataTypes.INTEGER,
        allowNull: false
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
    freezeTableName: true,
    timestamps: false
});

/**
 * todo: get all the users from the database
 * @param {Callback} resolve function to return the result
 */
exports.getAll = async (resolve) => {
    User.findAll({
        attributes: ['id', 'code', 'uuid', 'name', 'username', 'photo', 'rol', 'email']
    }).then((users) => {
        resolve({
            status: 200,
            data: users
        });
    }).catch((error) => {
        resolve({
            status: 500,
            data: error
        });
    });
}
/**
 * todo: insert a new user based on the user object
 * @param {Callback} resolve function to return the result
 */
exports.create = async (user, resolve) => {
    User.create({
        code: user.code,
        uuid: user.uuid,
        name: user.name,
        username: user.username,
        rol: user.rol,
        email: user.email,
        password: encrypt("12345678")
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
/**
 * todo: authenticate the user based on the username and password
 * @param {Callback} resolve function to return the result
 */
exports.authenticate = async (username, password, resolve) => {
    mysqlcon.query(
        'CALL authAdmin(:username, :password)',
        {
            replacements: {
                username: username,
                password: password
            },
            type: QueryTypes.SELECT
        }
    ).then((result) =>{
        resolve({
            status: 200,
            data: result[0]['0']
        });
    }).catch(e => {
        console.log(e)
    })
}
exports.update = async (user, resolve) => {
    User.update({
        name: user.name,
        username: user.username,
        rol: user.rol,
        email: user.email
    },{
        where: {
            id: user.id
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
    User.destroy({
        where: {
            id: id.id
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