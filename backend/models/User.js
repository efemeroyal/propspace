const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // always store email in lowercase so "User@Test.com" and "user@test.com" are the same account
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // IMPORTANT: never return password field in queries by default
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    avatar: {
      type: String, // URL string — no file uploads needed, just a link
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// Hash password BEFORE saving to the database.
// Using a pre-save hook keeps this logic in the model, it runs automatically whether you create or update, so you can't accidentally forget to hash in a controller.
userSchema.pre("save", async function (next) {
  // Only re-hash if the password field was actually changed.
  // Without this check, every profile update would re-hash an already-hashed password and break login.
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10); // 10 rounds is the standard balance of security vs speed
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare a plain-text candidate password against the stored hash.
// Attaching it to the schema means any User document can call user.comparePassword(...)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
