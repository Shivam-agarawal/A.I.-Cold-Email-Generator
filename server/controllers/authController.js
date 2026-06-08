const sendOtpEmail = require("../utils/sendOtpEmail.js");
const User = require("../models/User");
// This code defines a controller function registerUser that handles user registration. It performs validation on the input data and creates a new user in the database if the input is valid. The function also includes error handling to return appropriate responses based on the success or failure of the registration process.
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Generate OTP and set expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Check if user already exists
    const user = await User.create({
      username: username,
      email,
      password,
      otp,
      otpExpiry,
    });
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.otp;
    delete userObj.otpExpiry;
    delete userObj.isVerified;
    delete userObj.__v;
    delete userObj._id;
    res
      .status(201)
      .json({ message: "User registered successfully", user: userObj });

    //Otp Validation
    // After creating the user, we generate a One-Time Password (OTP) and set an expiry time for it. The OTP is a 6-digit random number that is valid for 10 minutes. We then attempt to send this OTP to the user's email address using a hypothetical sendOtpEmail function. If there is an error while sending the email, we catch it and return a 500 Internal Server Error response with an appropriate message.
    try {
      // sendOtpEmail expects `{ email, subject, message }`
      await sendOtpEmail({
        email,
        subject: "Your OTP Code for Registration",
        message: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
      });
    } catch (error) {
      // Log email errors but don't attempt to send another HTTP response
      console.error("Error sending OTP email:", error.message || error);
    }

    // In this code, we define an asynchronous function registerUser that handles user registration. It first extracts the username, email, and password from the request body. It then performs validation checks to ensure all fields are provided, the password meets the minimum length requirement, and the email is in a valid format. If any of these checks fail, it returns a 400 Bad Request response with an appropriate error message. If all validations pass, it creates a new user in the database using the User model and returns a 201 Created response with a success message and the user data.
  } catch (error) {
    console.error("Register error:", error);
    // Return error message for debugging (remove or sanitize in production)
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

exports.login = async (req, res) => {
  return res.status(501).json({ message: "Login is not implemented yet" });
};

exports.verifyOtp = async (req, res) => {
  return res
    .status(501)
    .json({ message: "OTP verification is not implemented yet" });
};
