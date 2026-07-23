const express = require("express");
const {
  getAllTask,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controller/taskController");
const protect = require("../middleware/protect");
const authorize = require("../middleware/authorize");

const route = express.Router();

route.get("/", protect, authorize("admin","user"),getAllTask);
route.get("/:id", protect,authorize("admin","user"), getTaskById);
route.post("/", protect, createTask);
route.patch("/:id", protect, authorize("admin","user"),updateTask);
route.delete("/:id", protect,authorize("admin","user"), deleteTask);

module.exports = route;
