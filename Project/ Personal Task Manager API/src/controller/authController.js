const authService = require("../service/authService");

const registerUser = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res
      .status(201)
      .json({ data: user, message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body);
    res.status(200).json({ data: user, message: "Login successful" });
  } catch (error) {
    next(error);
  }
};

module.exports = {registerUser,loginUser}