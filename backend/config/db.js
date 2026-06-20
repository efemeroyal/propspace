const mongoose = require("mongoose");

// Separating DB connection into its own file keeps server.js clean
// and makes it easy to mock in tests later if needed.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit the process — there's no point running the API without a DB
    process.exit(1);
  }
};

module.exports = connectDB;
