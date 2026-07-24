// middleware/validate.js
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // show ALL errors at once, not just first one
    });

    if (error) {
      // Extract all error messages into clean array
      const messages = error.details.map((detail) => detail.message);

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    req.body = value; // use validated and sanitized data
    next();
  };
};

module.exports = validate;