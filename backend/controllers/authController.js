const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper: create and sign a JWT containing just the user's ID.
// We store only the ID in the token — not name, email, or role —
// so the token stays small and stale data (e.g. old email) never leaks.
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Basic presence check before hitting the DB
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    }

    // Check for duplicates manually so we can return a clear message.
    // Mongoose's unique index would also throw, but its error message
    // is harder to parse cleanly on the frontend.
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? "Email" : "Username";
      return res.status(400).json({ message: `${field} is already in use` });
    }

    // Password hashing happens in the User model pre-save hook —
    // we just pass the plain text here and the model handles it.
    const user = await User.create({ username, email, password, name });

    const token = signToken(user._id);

    // 201 Created — a new resource was created
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // .select("+password") re-includes the password field for THIS query only,
    // since we set select: false on the schema. We need it here to compare.
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      // Return the same vague message whether email or password is wrong.
      // Specific messages like "email not found" help attackers enumerate accounts.
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { register, login };
