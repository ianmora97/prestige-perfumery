const Producto = require('../models/product.model');
const messager = require('../helpers/messager');


function checkProducto(id){
    Producto.findOne(id, (result) => {
        if(result.data.stock <= result.data.notification){
            const MessageOutofStock = `🔴 Prestigue Perfumery 🔴 %0A%0A📦 <b>${result.data.name} - ${result.data.brand}</b> %0A📋Tiene ${result.data.stock} unidades en stock%0A%0A%0A`
            messager.sendAlertMessage(MessageOutofStock);
        }
    });
}
function checkProductoUUID(uuid){
    Producto.findOneuuid(uuid, (result) => {
        if(result.data.stock <= result.data.notification){
            const MessageOutofStock = `🔴 Prestigue Perfumery 🔴 %0A%0A📦 <b>${result.data.name} - ${result.data.brand}</b> %0A📋Tiene ${result.data.stock} unidades en stock%0A%0A%0A`
            messager.sendAlertMessage(MessageOutofStock);
        }
    });
}

module.exports = {
    checkProducto,
    checkProductoUUID
}