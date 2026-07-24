const Task = require("../models/Task");
const {
  ValidationError,
  NotFoundError,
  AppError,
} = require("../errors/AppError");
//  constants
const validStatus = ["pending", "in-progress", "completed"];
const validPriority = ["low", "medium", "high"];

// get all task with filter
const getAllTask = async (query, requestingUser) => {
  const filter = {};

  if (requestingUser.role !== "admin") {
    filter.owner = requestingUser._id;
  }
  const { title, status, priority } = query;
  if (title) {
    filter.title = title;
  }
  if (status) {
    filter.status = status;
  }
  if (priority) {
    filter.priority = priority;
  }

  return await Task.find(filter);
};

// get by id
const getTaskById = async (id, requestingUser) => {
  const task = await Task.findById(id);
  if (!task) {
    throw new NotFoundError("Task not found!");
  }

  if (
    requestingUser.role !== "admin" &&
    task.owner.toString() !== requestingUser._id.toString()
  ) {
    throw new AppError("Not authorized to access this task", 403);
  }
  return task;
};

const createTask = async (userId, data) => {
  const { title, status, description, priority } = data;

  if (status && !validStatus.includes(status)) {
    throw new ValidationError("Invalid status value");
  }
  if (priority && !validPriority.includes(priority)) {
    throw new ValidationError("Invalid priority value");
  }

  const task = await Task.create({ ...data, owner: userId });
  return task;
};

const updateTask = async (id, data, requestingUser) => {
  const task = await Task.findById(id);
  if (!task) throw new NotFoundError("Task not found");

  if (
    requestingUser.role !== "admin" &&
    task.owner.toString() !== requestingUser._id.toString()
  ) {
    throw new AppError("Not authorized to update this task", 403);
  }

  const { title, description, status, priority } = data;
  if (status && !validStatus.includes(status))
    throw new ValidationError("Invalid status value");
  if (priority && !validPriority.includes(priority))
    throw new ValidationError("Invalid priority value");

  return await Task.findByIdAndUpdate(id, data, { new: true });
};

const deleteTask = async (id, requestingUser) => {
  const task = await Task.findById(id);
  if (!task) throw new NotFoundError("Task not found");

  if (
    requestingUser.role !== "admin" &&
    task.owner.toString() !== requestingUser._id.toString()
  ) {
    throw new AppError("Not authorized to delete this task", 403);
  }

  await Task.findByIdAndDelete(id);
};

module.exports = {
  getAllTask,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
