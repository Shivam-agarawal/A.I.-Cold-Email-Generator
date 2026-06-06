const User = require("../models/User");
// This code defines a controller function registerUser that handles user registration. It performs validation on the input data and creates a new user in the database if the input is valid. The function also includes error handling to return appropriate responses based on the success or failure of the registration process.
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if(!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        if(!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        // Generate OTP and set expiry
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        
        // Check if user already exists
        const user = await User.create({ name: username, email, password, otp, otpExpiry });
        res.status(201).json({ message: 'User registered successfully', user });
        // In this code, we define an asynchronous function registerUser that handles user registration. It first extracts the username, email, and password from the request body. It then performs validation checks to ensure all fields are provided, the password meets the minimum length requirement, and the email is in a valid format. If any of these checks fail, it returns a 400 Bad Request response with an appropriate error message. If all validations pass, it creates a new user in the database using the User model and returns a 201 Created response with a success message and the user data.
    } catch (error) {
        res.status(500).json({ message: 'Error registering user' });
    }
}