const express = require("express");
const logger = require("./middleware/logger");
const { NotFoundError } = require("./errors/AppError");
const userRouter = require("./routes/authRoutes");
const taskRouter = require("./routes/taskRoutes");
const app = express();

app.use(express.json());
app.use(logger);

app.use("/api/auth/", userRouter);
app.use("/api/tasks", taskRouter);

app.use("/{*splat}", (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: { name: err.name, message: err.message },
  });
});

module.exports = app;
