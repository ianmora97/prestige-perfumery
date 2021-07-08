const express = require('express');
const router = express.Router();

const db = require('../database');

// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/flask',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

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

// ! ------------------------------ SERVE FROM MOONGODB ------------------------------------
// ? ------------------------------ NOTIFICATIONS ---------------------------------
// * SELECT NOTIFICATIONS




// ! ------------------------------ SERVE FROM DB ------------------------------------
// ? ------------------------------ CARS ---------------------------------
// * SELECT CLIENTS
router.get('/api/clients/get',(req,res)=>{
    db.query('SELECT * FROM vt_client',(err,rows,fields)=>{
        if(!err){
            let [filas,campos,response] = [rows,fields,'good'];
            res.json({filas,campos,response});
        }else{
            res.json({text:err,response:'error'});
        }
    });
});

// ? ------------------------------ CARS ---------------------------------
// * SELECT CARS
router.get('/api/carros/get',(req,res)=>{
    db.query('SELECT * FROM vt_cars',(err,rows,fields)=>{
        if(!err){
            let [filas,campos,response] = [rows,fields,'good'];
            res.json({filas,campos,response});
        }else{
            res.json({text:err,response:'error'});
        }
    });
});



module.exports = router;