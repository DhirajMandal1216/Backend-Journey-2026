require("dotenv").config();
const express = require("express");
const { NotFoundError } = require("./errors/AppError");
const logger = require("./middleware/logger");
const userRouter = require("./routes/userRoutes");
// express instance
const app = express();

// middleware
app.use(express.json());
app.use(logger);

// routes
app.use("/api/users", userRouter);

// notfound
app.use("/{*splat}", (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
});

// error
app.use((err, req, res, next) => {
  console.error(`[Error] ${err.name}: ${err.message}`);
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      name: err.name,
      message: err.message,
    },
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on http://localhost:3000");
});
