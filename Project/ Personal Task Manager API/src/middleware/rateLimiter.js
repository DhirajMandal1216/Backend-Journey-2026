const rateLimit = require("express-rate-limit");

// General rate limit — all routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per 15 minutes per IP
  message: {
    success: false,
    message: "Too many requests — please try again after 15 minutes"
  },
  standardHeaders: true, // adds RateLimit headers to response
  legacyHeaders: false,
});

// Strict limit for auth routes — prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // only 10 login attempts per 15 minutes
  message: {
    success: false,
    message: "Too many login attempts — please try again after 15 minutes"
  },
});

module.exports = { generalLimiter, authLimiter };