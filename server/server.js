const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { generalLimiter, authLimiter, aiLimiter } = require("./middleware/rateLimiter");

// Load environment variables from .env file
dotenv.config();
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const port = process.env.PORT || 3000;
// Connect to MongoDB
connectDB();

// Create an Express application
const app = express();
// Create an Express application
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data

// Enable CORS for all routes
app.use(cors());

// Apply general rate limit to all routes
app.use(generalLimiter);

// Define routes with route-specific rate limits
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An unexpected error occurred" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
