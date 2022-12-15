const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();

const User = require('../models/user.model');

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.authenticate(username, password, (result) => {
        if(result.status === 200 && result.data !== null && result.data.verified == 'true'){
            jwt.sign({user: username}, process.env.SECRET_KEY, 
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

router.get('/admin/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

module.exports = router;