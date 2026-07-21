const express = require("express");
const {
  getAllTask,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controller/taskController");
const protect = require("../middleware/protect");

const route = express.Router();

route.get("/", getAllTask);
route.get("/:id", getTaskById);
route.post("/", protect, createTask);
route.patch("/:id",protect, updateTask);
route.delete("/:id",protect, deleteTask);

module.exports = route;
