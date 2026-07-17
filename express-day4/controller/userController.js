const userService = require("../service/userService");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await userService.getUserById(id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, age } = req.body;
    const user = await userService.createUser({ name, email, age });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await userService.updateUser(id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await userService.deleteUser(id);
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };