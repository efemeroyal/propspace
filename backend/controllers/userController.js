const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET /api/users/me
// Protected — returns the logged-in user's profile.
// req.user is already attached by verifyToken middleware, so no DB call needed here.
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      name: req.user.name,
      phone: req.user.phone,
      avatar: req.user.avatar,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

// PUT /api/users/me
// Protected — update name, phone, avatar. Email and username are NOT changeable
// here intentionally — those are identity fields tied to uniqueness constraints.
const updateMe = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    // Build update object with only the fields that were sent
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (avatar !== undefined) updates.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    console.error("Update me error:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// PUT /api/users/me/password
// Protected — change password by verifying the old one first.
// This is a separate endpoint from updateMe so there's no risk of accidentally
// accepting a password field in a general profile update.
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old password and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    // Re-fetch user with password field included — it's excluded by default (select: false)
    const user = await User.findById(req.user._id).select("+password");

    // Verify old password before allowing the change — rubric requirement
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Assigning to user.password triggers the pre-save hook to re-hash it
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ message: "Server error updating password" });
  }
};

module.exports = { getMe, updateMe, updatePassword };
