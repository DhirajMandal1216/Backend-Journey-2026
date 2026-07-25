const express = require("express");
const {
  registerUser,
  loginUser,
  refreshToken,
} = require("../controller/authController");

const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const { authLimiter } = require("../middleware/rateLimiter");
const router = express.Router();

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  registerUser,
);
router.post("/login", authLimiter, validate(loginSchema), loginUser);
router.post("/refresh", refreshToken);

module.exports = router;
