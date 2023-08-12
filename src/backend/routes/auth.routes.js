const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();

const User = require('../models/user.model');

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.authenticate(username, password, (result) => {
        if(result.status === 200 && result.data !== null && result.data.verified == 'true'){
            console.log("save")
            jwt.sign({user: username, rol: result.data.rol}, process.env.SECRET_KEY, 
            {expiresIn: '30d'}, (err, token) => {
                if(err){
                    res.status(500).json({error: err});
                }else{
                    res.status(result.status).json({
                        token: token, 
                        data: result.data, 
                        username: username,
                        photo: result.data.pic
                    });
                }
            });
        }
    });
});

const Cliente = require('../models/cliente.model');

router.post('/cliente/login', (req, res) => {
    const { username, password } = req.body;
    Cliente.authenticate(username, password, (result) => {
        if(result.status === 200 && result.data !== null && result.data.verified == 'true'){
            jwt.sign({
                cedula: username,
                nombre: result.data.nombre,
                id: result.data.id,
                nivel: result.data.level,
            }, process.env.SECRET_KEY, 
            {expiresIn: '30d'}, (err, token) => {
                if(err){
                    res.status(500).json({error: err});
                }else{
                    res.status(result.status).json({
                        token: token, 
                        data: {
                            id: result.data.data.id,
                            nombre: result.data.data.nombre,
                            cedula: result.data.data.cedula,
                            telefono: result.data.data.phone,
                            email: result.data.data.email,
                            nivel: result.data.data.level,
                            direccion: result.data.data.direction,
                            createdAt: result.data.data.createdAt
                        },
                    });
                }
            });
        }else{
            res.status(result.status).json({
                status: result.status,
                message: "Usuario o contraseña incorrectos",
                error: "Unauthorized"
            });
        }
    });
});

router.get('/admin/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

router.get('/cliente/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

module.exports = router;