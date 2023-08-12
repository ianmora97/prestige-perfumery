const { destroyAnalytics } = require('./analytics');
const db = require('../database/sqlitecon');

function deleteData(){
    destroyAnalytics().then(e =>{
        db.query('SELECT COUNT(*) FROM analytics')
        .then((result) => {
            console.log('Data deleted', result[0]);
        });
    }).catch(err => {
        console.log(err);
    });
}

deleteData();