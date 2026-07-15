const { NotFoundError, ValidationError } = require("./errors/AppError");
const express = require("express");
const app = express();
app.use(express.json());

let users = [
  { id: 1, name: "Dhiraj", email: "dhiraj@gmail.com", age: 25 },
  { id: 2, name: "Rahul", email: "rahul@gmail.com", age: 30 },
];

// logger middleware
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

const protect = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized user ,token missing" });
  }
  req.user = { id: 1, name: "Dhiraj" };
  next();
};
app.use(logger);

// routes
app.put("/users/:id", protect, (req, res, next) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id); // findIndex not find

  if (userIndex === -1) return next(new NotFoundError("User not found"));

  const { name, email, age } = req.body;
  users[userIndex] = { ...users[userIndex], name, email, age }; // actually update

  res.status(200).json({ // 200 for updates, not 201
    message: "User updated successfully",
    data: users[userIndex]
  });
});


app.delete("/users/:id", protect, (req, res, next) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) return next(new NotFoundError("User not found"));

  users.splice(userIndex, 1);
  res.status(201).json({ message: "User deleted!" });
});

app.use("*", (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
});

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      name: err.name,
      message: err.message,
    },
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
