const { Sequelize } = require('sequelize');
const path = require('path');

const sqlite = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '/sqlitedb.db'),
    logging: false
});

// authenticate database and avoid logging
sqlite.authenticate().then(() => {
    console.log('[OK] SQLite DB connected');
}).catch((error) => {
    console.error('[ERR] Unable to connect to the database: ', error);
});



module.exports = sqlite;