const express = require('express');
const router = express.Router();

const db = require('../database');

router.get('/', (req, res) => {
    res.send(`
    <center>
        <br>
        <h2>API Restful Integration with Flask made in Nodejs</h2>
        <p>Microservice with DataBase</p>
        <p>To test API use <a target="_blank" href="https://insomnia.rest/download">Insomnia API testing tool</a></p>
    </center>
    `);
});

// ! ------------------------------ SERVE FROM DB ------------------------------------
// ? ------------------------------ Clients ---------------------------------
// * SELECT CLIENTS
router.get('/api/clients/get',(req,res)=>{
    db.query('SELECT * FROM cliente',(err,rows,fields)=>{
        if(!err){
            let [filas,campos,response] = [rows,fields,'good'];
            res.json({filas,campos,response});
        }else{
            res.json({text:err,response:'error'});
        }
    });
});

// * UPDATE CLIENT
router.get('/api/clients/update',(req,res)=>{
    console.log(req)
    // db.query('UPDATE cliente SET nombre = ?, correo = ? WHERE id = ?"',
    // [req.body.name,req.body.email,req.body.id],
    // (err,rows,fields)=>{
    //     if(!err){
    //         res.json({response:'updated'});
    //     }else{
    //         res.json({text:err,response:'error'});
    //     }
    // });
});



module.exports = router;