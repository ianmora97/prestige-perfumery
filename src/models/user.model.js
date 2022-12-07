const mysqlcon = require('../database/mysqlcon');
const { DataTypes } = require('sequelize');


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
    rol:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rol_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    phone:{
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
    User.findAll().then((users) => {
        console.log(users);
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
    User.create(user).then((user) => {
        resolve({
            status: 200,
            data: user
        });
    }).catch((error) => {
        resolve({
            status: 500,
            data: error
        });
    });
}

