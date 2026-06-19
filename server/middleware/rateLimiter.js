const rateLimit = require("express-rate-limit");

// General API rate limit — 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later.",
  },
});

// Auth rate limit — 10 requests per 15 minutes per IP
// Stricter to prevent brute-force login / registration spam
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts, please try again after 15 minutes.",
  },
});

// AI generation rate limit — 20 requests per 15 minutes per IP
// Moderate because each call hits the Groq API (costs money / has its own limits)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Generation limit reached. Please wait before generating more emails.",
  },
});

module.exports = { generalLimiter, authLimiter, aiLimiter };
