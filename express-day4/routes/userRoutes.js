const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect"); // ✅ no curly braces
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require("../controller/userController");

router.get("/",      getAllUsers);
router.get("/:id",   getUserById);
router.post("/",     createUser);
router.put("/:id",   protect, updateUser);
router.delete("/:id", protect, deleteUser);

module.exports = router;