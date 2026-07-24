// validators/taskValidator.js
const Joi = require("joi");

const createTaskSchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      "any.required": "Title is required",
      "string.min":   "Title must be at least 2 characters"
    }),

  description: Joi.string()
    .min(5)
    .required()
    .messages({
      "any.required": "Description is required",
      "string.min":   "Description must be at least 5 characters"
    }),

  status: Joi.string()
    .valid("pending", "in-progress", "completed")
    .default("pending")
    .messages({
      "any.only": "Status must be pending, in-progress, or completed"
    }),

  priority: Joi.string()
    .valid("low", "medium", "high")
    .default("medium")
    .messages({
      "any.only": "Priority must be low, medium, or high"
    }),

  dueDate: Joi.date().optional(),
});

const updateTaskSchema = Joi.object({
  title:       Joi.string().min(2).max(100).optional(),
  description: Joi.string().min(5).optional(),
  status:      Joi.string().valid("pending", "in-progress", "completed").optional(),
  priority:    Joi.string().valid("low", "medium", "high").optional(),
  dueDate:     Joi.date().optional(),
});

module.exports = { createTaskSchema, updateTaskSchema };
