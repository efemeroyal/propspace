const express = require("express");
const router = express.Router();
const { getMe, updateMe, updatePassword } = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");

// All user routes are protected — you must be logged in to touch your profile

// GET  /api/users/me           → read your profile
// PUT  /api/users/me           → update name / phone / avatar
// PUT  /api/users/me/password  → change password (requires old password)
router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);
router.put("/me/password", verifyToken, updatePassword);

module.exports = router;
