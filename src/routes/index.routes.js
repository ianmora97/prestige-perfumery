const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require("dotenv").config();

router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;