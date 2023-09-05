const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();

router.get('/', (req, res) => {
    res.render('login');
});

router.get('/admin/login', (req, res) => {
    res.render('login');
});


module.exports = router;