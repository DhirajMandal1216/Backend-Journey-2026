const express = require("express");
const {generalLimiter} = require("./middleware/rateLimiter");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("./middleware/logger");
const { NotFoundError } = require("./errors/AppError");
const userRouter = require("./routes/authRoutes");
const taskRouter = require("./routes/taskRoutes");
const corsOptions = require("./config/cors");
const app = express();

// security middleware
app.use(cors(corsOptions));
app.use(generalLimiter);
app.use(helmet())

app.use(express.json());
app.use(logger);

app.use("/api/auth/", userRouter);
app.use("/api/tasks", taskRouter);

app.use("/{*splat}", (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    // Full details — you're debugging
    res.status(statusCode).json({
      success: false,
      error: { name: err.name, message: err.message, stack: err.stack },
    });
  } else {
    // Production — safe, generic message only
    res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? "Something went wrong" : err.message,
    });
  }
});

module.exports = app;