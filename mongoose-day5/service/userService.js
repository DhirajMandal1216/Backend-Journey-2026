const { NotFoundError, ValidationError } = require("../errors/AppError");
const User = require("../models/User");

const getAllUsers = async () => {
  const user = await User.find();
  return user;
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError(`User with id ${id} not found`);
  return user;
};

const createUser = async ({ name, email, age }) => {
  if (!name) throw new ValidationError("Name is required");
  if (!email) throw new ValidationError("Email is required");

  const existEmail = await User.findOne({ email });
  if (existEmail) throw new ValidationError("Email already use");

  const user = await User.create({ name, email, age });
  return user;
};

const updateUser = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, data, { new: true });
  if (!user) throw new NotFoundError(`User with id ${id} not found`);
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new NotFoundError(`User with id ${id} not found`);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
