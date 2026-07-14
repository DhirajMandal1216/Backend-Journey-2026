const express = require("express");
const app = express();
app.use(express.json());

/**GET    /api/users         → return all users
GET    /api/users/:id     → return one user (404 if not found)
POST   /api/users         → create new user (validate name + email)
PUT    /api/users/:id     → update user (404 if not found)
DELETE /api/users/:id     → delete user (404 if not found)
 */

// Your in-memory database
let users = [
  { id: 1, name: "Dhiraj", email: "dhiraj@gmail.com", age: 25 },
  { id: 2, name: "Rahul", email: "rahul@gmail.com", age: 30 },
];

app.get("/api/users", (req, res) => {
  res.status(200).json({ message: "User fetch successfully", data: users });
});

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ message: "User fetch successfully", data: user });
});

app.post("/api/users", (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "name and email is required" });
  }
  const newUser = { id: Date.now(), name, email, age };
   users.push(newUser); 

  res.status(201).json({ message: "user created successfully", data: newUser });
});

// PUT — actually update the user ✅
app.put("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const { name, email, age } = req.body;

  // merge existing user with new data
  users[userIndex] = { ...users[userIndex], name, email, age };

  res.status(200).json({
    message: "User updated successfully",
    data: users[userIndex]
  });
});

// DELETE — actually remove the user ✅
app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users.splice(userIndex, 1); // remove from array

  res.status(200).json({ message: "User deleted successfully" });
});
app.listen(3000, () => {
  console.log("Server running on  http://localhost:3000");
});
