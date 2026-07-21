const protect = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized — no token provided"
    });
  }

  // Fake token check — replace with jwt.verify() in Week 3
  if (token === "admin-token") {
    req.user = { id: "6a5d94b1d91abd1d66e76076", name: "Dhiraj", role: "admin" };
  } else if (token === "user-token") {
    req.user = { id: "2", name: "Rahul", role: "user" };
  } else {
    return res.status(401).json({
      success: false,
      message: "Unauthorized — invalid token"
    });
  }

  next();
};

module.exports = protect;