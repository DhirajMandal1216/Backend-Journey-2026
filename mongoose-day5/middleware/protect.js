const protect = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized — token missing" });
  }
  req.user = { id: 1, name: "Dhiraj" };
  next();
};

module.exports = protect; // default export