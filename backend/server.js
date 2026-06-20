const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env BEFORE anything else uses them
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- Middleware ---

// cors() allows the React frontend (running on a different port / domain)
// to make requests to this API. In production you'd restrict the origin,
// but for this project allowing all origins is fine.
app.use(cors());

// express.json() parses incoming request bodies as JSON so req.body is usable.
// Without this, req.body would be undefined in all POST/PUT handlers.
app.use(express.json());

// --- Routes ---
// Mount each router under its own path prefix.
// This is the clean RESTful structure the rubric requires:
// /api/auth/register, /api/properties, /api/users/me etc.
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// --- Health check ---
// A simple GET / lets you verify the server is running without Postman
app.get("/", (req, res) => {
  res.json({ message: "PropSpace API is running" });
});

// --- 404 handler ---
// If no route matched, return a clean 404 instead of Express's default HTML error page
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// --- Global error handler ---
// Any unhandled error thrown in a controller lands here.
// The 4-argument signature (err, req, res, next) is how Express identifies
// a function as an error handler — don't remove the `next` param.
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`PropSpace server running on port ${PORT}`);
});
