const sendOtpEmail = require("../utils/sendOtpEmail.js");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
//
const generateToken = function (id) {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
};

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

    // Create user
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
    res
      .status(201)
      .json({ message: "OTP sent to your email. Please verify.", userId: user._id, user: userObj });

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

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const user = await User.findOne({ email }).select(
      "+otp +otpExpiry +isVerified",
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isVerified) {
      const token = generateToken(user._id);
      const existingUser = await User.findById(user._id);
      return res.status(200).json({
        token,
        name: existingUser.username,
        email: existingUser.email,
        _id: existingUser._id,
        message: "User is already verified",
      });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    //
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    //
    const token = generateToken(user._id);
    const verifiedUser = await User.findById(user._id);
    const verifiedUserObj = verifiedUser.toObject();
    delete verifiedUserObj.__v;
    res.status(200).json({
      token,
      name: verifiedUserObj.username,
      email: verifiedUserObj.email,
      _id: verifiedUserObj._id,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email }).select("+password +isVerified");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.isVerified;
    delete userObj.__v;
    res.status(200).json({
      token,
      name: userObj.username,
      email: userObj.email,
      _id: userObj._id,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Alias so authRoutes.js can use either exports.login or exports.loginUser
exports.login = exports.loginUser;

// Forgot Password — sends an OTP to the user's email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email }).select("+isVerified");
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ message: "If this email is registered, you will receive a reset code." });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    try {
      await sendOtpEmail({
        email,
        subject: "MailGen AI — Password Reset Code",
        message: `Your password reset code is ${otp}. It is valid for 10 minutes. If you did not request this, please ignore this email.`,
      });
    } catch (err) {
      console.error("Error sending reset email:", err.message || err);
    }

    res.status(200).json({ message: "If this email is registered, you will receive a reset code." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Error processing request", error: error.message });
  }
};

// Reset Password — verifies OTP and sets new password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email }).select("+otp +otpExpiry +password");
    if (!user) {
      return res.status(400).json({ message: "Invalid request" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "Code has expired. Please request a new one." });
    }

    user.password = newPassword; // pre-save hook will hash it
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};
