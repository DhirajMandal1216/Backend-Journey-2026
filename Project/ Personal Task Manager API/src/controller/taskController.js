const taskService = require("../service/taskService");

const getAllTask = async (req, res, next) => {
  try {
    const query = req.query;
    const data = await taskService.getAllTask(query,req.user);
    res.status(200).json({ data, message: "Task fetched successfully" });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await taskService.getTaskById(id,req.user);
    res.status(200).json({ data, message: "Task fetched successfully" });
  } catch (error) {
    next(error)
  }
};

const createTask = async (req, res, next) => {
  try {
    const userId = req.user.id
    const data = await taskService.createTask(userId,req.body);
    res.status(201).json({ data, message: "Task created successfully" });
  } catch (error) {
    next(error)
  }
};
const updateTask = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await taskService.updateTask(id,req.body,req.user);
    res.status(200).json({ data, message: "Task updated successfully" });
  } catch (error) {
    next(error)
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await taskService.deleteTask(id,req.user);
    res.status(200).json({ data, message: "Task deleted successfully" });
  } catch (error) {
    next(error)
  }
};

module.exports = { getAllTask, getTaskById, createTask, updateTask,deleteTask };