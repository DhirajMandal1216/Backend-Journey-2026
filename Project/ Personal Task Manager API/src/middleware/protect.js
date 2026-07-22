const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { AppError } = require("../errors/AppError");

const protect = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — no token provided"
      });
    }

    // 2. Extract token — remove "Bearer " prefix
    const token = authHeader.split(" ")[1];
    // "Bearer eyJhbG..." → ["Bearer", "eyJhbG..."] → [1] = "eyJhbG..."

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id: "64abc123", role: "user", iat: ..., exp: ... }

    // 4. Find user from decoded id
    const user = await User.findById(decoded.id).select("-password");
    // .select("-password") → get all fields EXCEPT password

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — user no longer exists"
      });
    }

    // 5. Attach user to request
    req.user = user;
    next();

  } catch (error) {
    // jwt.verify throws error if token is invalid or expired
    return res.status(401).json({
      success: false,
      message: "Unauthorized — invalid or expired token"
    });
  }
};

module.exports = protect;