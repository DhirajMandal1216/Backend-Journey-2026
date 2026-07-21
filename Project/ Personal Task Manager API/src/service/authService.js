const User = require("../models/User");
const { ValidationError, NotFoundError } = require("../errors/AppError");
const registerUser = async (data) => {
  const { name, email, password } = data;
  if (!name) throw new ValidationError("Name is required");
  if (!email) throw new ValidationError("Email is required");
  if (!password) throw new ValidationError("Password  is required");

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ValidationError("Email already exists");
  }

  const user = await User.create(data);
  return user;
};

const loginUser = async (data) => {
  const { email, password } = data;
  if (!email) throw new ValidationError("Email is required");
  if (!password) throw new ValidationError("Password is required");

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (user.password !== password) {
    throw new ValidationError("Invalid credentials");
  }

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

module.exports = { registerUser, loginUser };
