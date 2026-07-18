// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],  // validation built in
      trim: true,                             // removes whitespace
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,                           // no duplicate emails
      lowercase: true,                        // auto converts to lowercase
      trim: true,
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [120, "Age seems too high"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],               // only these values allowed
      default: "user",                        // default value
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt fields
  }
);

// Model — the interface to interact with the collection
const User = mongoose.model("User", userSchema);
// "User" → collection name becomes "users" (lowercase + plural) automatically

module.exports = User;