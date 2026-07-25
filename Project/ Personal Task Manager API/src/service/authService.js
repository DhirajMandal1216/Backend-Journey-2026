const User = require("../models/User");
const { ValidationError, NotFoundError } = require("../errors/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    },
  );
};

const createRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });
};

const registerUser = async (data) => {
  const { name, email, password } = data;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ValidationError("Email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ ...data, password: hashedPassword });
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const loginUser = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ValidationError("Invalid credentials");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ValidationError("Invalid credentials");
  }

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ValidationError("Invalid refresh token");
    }

    const accessToken = createAccessToken(user);

    return {
      accessToken,
    };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ValidationError("Refresh token expired");
    }

    if (error.name === "JsonWebTokenError") {
      throw new ValidationError("Invalid refresh token");
    }

    throw error;
  }
};

module.exports = { registerUser, loginUser, refreshAccessToken };
