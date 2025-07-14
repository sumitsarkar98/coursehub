import jwt from "jsonwebtoken";

// check Auth middleware
const authMiddleware = (req, res, next) => {
  // Read token from cookie
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "please login again! session expired" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded payload to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

export default authMiddleware;
