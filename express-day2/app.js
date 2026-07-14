const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my express Express API!" });
});

// req.params
// :id is a parameter — acts like a variable in the URL
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  console.log(id); // whatever was in the URL

  res.json({ message: `Getting user with id: ${id}` });
});

// Multiple params
app.get("/users/:userId/orders/:orderId", (req, res) => {
  const { userId, orderId } = req.params;
  res.json({ userId, orderId });
});

// req.query
app.get("/users", (req, res) => {
  const { page, limit, sort } = req.query;

  console.log(page);
  console.log(limit);
  console.log(sort);

  res.json({ page, limit, sort });
});

app.listen(3000, () => {
  console.log("Server running http://localhost:3000");
});
