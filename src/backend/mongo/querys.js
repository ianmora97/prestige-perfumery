require("dotenv").config();
const Dashboard = require('../models/dashboard.schema');
const con = require('../database/mongocon');
function dashboardProducto(){
    const producto = {
        id: 1,
        name: "Productos",
        buttons: [
            {
                extend: "pdf",
                text: '<i class="fa-solid fa-print text-dark"></i> Exportar PDF',
                className: "btn btn-white",
                titleAttr: "Exportar PDF",
            },{
                extend: "excel",
                text: '<i class="fa-solid fa-file-excel text-dark"></i> Exportar Excel',
                className: "btn btn-white",
                titleAttr: "Exportar Excel",
            }
        ]
    }
    Dashboard.create(producto, (result) => {
        console.log(result);
    });
}
dashboardProducto();