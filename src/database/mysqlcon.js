/**
 * Connection to MySQL database by using sequelize
 */
const Sequelize = require("sequelize");
require("dotenv").config();

const mysqlcon = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    },
);
mysqlcon.authenticate().then(() => {
    console.log('[OK] MySQL DB connected');
}).catch((error) => {
    console.error('[ERR] Unable to connect to the database: ', error);
});

module.exports = mysqlcon;