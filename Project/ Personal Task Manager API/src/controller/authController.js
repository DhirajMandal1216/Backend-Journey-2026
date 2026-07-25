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

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const result = await authService.refreshAccessToken(
      refreshToken
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {registerUser,loginUser,refreshToken}