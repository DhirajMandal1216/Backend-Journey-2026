const Task = require("../models/Task");
const { ValidationError, NotFoundError } = require("../errors/AppError");
//  constants
const validStatus = ["pending", "in-progress", "completed"];
const validPriority = ["low", "medium", "high"];

// get all task with filter
const getAllTask = async (query) => {
  const filter = {};
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
const getTaskById = async (id) => {
  const task = await Task.findById(id);
  if (!task) {
    throw new NotFoundError("Task not found!");
  }
  return task;
};

const createTask = async (userId, data) => {
  const { title, status, description, priority } = data;

  if (!title) {
    throw new ValidationError("Name is required");
  }
  if (!description) {
    throw new ValidationError("Description is required");
  }
  if (status && !validStatus.includes(status)) {
    throw new ValidationError("Invalid status value");
  }
  if (priority && !validPriority.includes(priority)) {
    throw new ValidationError("Invalid priority value");
  }

  const task = await Task.create({ ...data, owner: userId });
  return task;
};

const updateTask = async (id, data) => {
  const { title, status, description, priority } = data;

  if (status && !validStatus.includes(status)) {
    throw new ValidationError("Invalid status value");
  }
  if (priority && !validPriority.includes(priority)) {
    throw new ValidationError("Invalid priority value");
  }

  const task = await Task.findByIdAndUpdate(
    id,
    data,
    { new: true ,
      runValidators:true
    },
  );
  if (!task) {
    throw new NotFoundError("Task not found!");
  }
  return task;
};

const deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  if (!task) {
    throw new NotFoundError("Task not found!");
  }
};

module.exports = {
  getAllTask,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
