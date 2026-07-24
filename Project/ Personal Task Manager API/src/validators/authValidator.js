// validators/authValidator.js
const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.min":   "Name must be at least 2 characters",
      "string.max":   "Name cannot exceed 50 characters",
      "any.required": "Name is required",
      "string.empty": "Name cannot be empty"
    }),

  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty"
    }),

  password: Joi.string()
    .min(6)
    .max(50)
    .required()
    .messages({
      "string.min":   "Password must be at least 6 characters",
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty"
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required"
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required"
  }),
});

module.exports = { registerSchema, loginSchema };