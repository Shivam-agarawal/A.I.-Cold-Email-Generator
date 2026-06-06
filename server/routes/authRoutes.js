const express = require('express');
const routers = express.Router();
const authController = require('../controllers/authController');


// Define routes for authentication
routers.post('/register', authController.register);
routers.post('/login', authController.login);
routers.post('/verify-otp', authController.verifyOtp);

module.exports = routers;