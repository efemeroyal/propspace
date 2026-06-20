const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// Routes layer responsibility: define the URL + HTTP verb, then delegate.
// No business logic lives here — that belongs in the controller.

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

module.exports = router;
