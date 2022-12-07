const express = require('express');
const router = express.Router();

/**
 * CRUD from User
 */
const USER = require('../controllers/user.controller');
router.get('/api/users/all', USER.getAll);



module.exports = router;