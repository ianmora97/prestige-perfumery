const Report = require('../models/report.schema');
const moment = require('moment');

const Tables = {
    "user": "Administracion",
    "product": "Productos",
    "bodega": "Bodega",
    "purchase": "Pedidos",
    "cliente": "Clientes",
    "proveedor": "Proveedores",
    "cambiodolar": "Cambio Dolar",
};

const Actions = {
    "POST": "Agregado",
    "PUT": "Actualizado",
    "DELETE": "Eliminado"
};


function report(req, res, next){
    if(req.originalUrl.includes('/api/v1') && (req.method == 'POST' || req.method == 'PUT' || req.method == 'DELETE')){
        console.log(req.params, req.body)
        const table = Tables[req.originalUrl.split('/')[3]];
        const thing = req.params.id || req.body.id || req.body.uuid || req.params.uuid  ;
        const date = moment().format('YYYY-MM-DD HH:mm:ss');
        const report = {
            table: table,
            who: req.who,
            row: thing,
            what: `${Actions[req.method]}`,
            when: date
        }
        console.log(report);
        Report.create(report, (result) => {
            console.log(`${moment().format('DD-MM HH:mm')} Reporte creado`);
        });
    }
    next();
}


module.exports = {
    report
}