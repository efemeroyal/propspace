const jwt = require("jsonwebtoken");
const User = require("../models/User");

// This middleware runs before any protected route handler.
// It validates the JWT and attaches the full user object to req.user
// so controllers don't have to look up the user themselves.
const verifyToken = async (req, res, next) => {
  let token;

  // JWT is sent in the Authorization header as: "Bearer <token>"
  // We check the header exists AND starts with "Bearer" before splitting
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    // 401 = not authenticated (no token provided at all)
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // jwt.verify throws if the token is expired, tampered with, or uses the wrong secret.
    // The decoded payload contains whatever we put in it at login time (user id).
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from DB to ensure the account still exists.
    // select("-password") excludes the password hash from the result —
    // same effect as select: false on the schema but applied here per-query.
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    next(); // token is valid — pass control to the route handler
  } catch (error) {
    // 401 for expired or invalid tokens
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = { verifyToken };
