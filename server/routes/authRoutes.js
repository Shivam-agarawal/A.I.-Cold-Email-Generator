const express = require("express");
const routers = express.Router();
const authController = require("../controllers/authController");

// Define routes for authentication
routers.post("/register", authController.registerUser);
routers.post("/login", authController.login);
routers.post("/verify-otp", authController.verifyOtp);
routers.post("/forgot-password", authController.forgotPassword);
routers.post("/reset-password", authController.resetPassword);

module.exports = routers;
