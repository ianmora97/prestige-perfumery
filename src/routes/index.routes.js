const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/admin/login', (req, res) => {
    res.render('login');
});

router.get('/login', (req, res) => {
    res.render('loginClient');
});


module.exports = router;