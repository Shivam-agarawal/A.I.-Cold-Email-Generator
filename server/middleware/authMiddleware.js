const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        if (!token) {
            return res
                .status(401)
                .json({ message: "Not authorized, no token", auth: false });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user to the request
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ message: "Not authorized, token failed", auth: false });
    }
};

module.exports = protect;


