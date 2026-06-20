const express = require("express");
const router = express.Router();
const {
  getProperties,
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");
const { verifyToken } = require("../middleware/auth");

// PUBLIC routes — no token required
// GET /api/properties          → full public feed (with optional ?city=&minPrice=&maxPrice=)
// GET /api/properties/:id      → single property detail
router.get("/", getProperties);
router.get("/my", verifyToken, getMyProperties); // MUST be defined before /:id or Express will treat "my" as an id param
router.get("/:id", getPropertyById);

// PROTECTED routes — verifyToken middleware runs first on each of these
// POST /api/properties         → create a new listing
// PUT /api/properties/:id      → update a listing (ownership checked in controller)
// DELETE /api/properties/:id   → delete a listing (ownership checked in controller)
router.post("/", verifyToken, createProperty);
router.put("/:id", verifyToken, updateProperty);
router.delete("/:id", verifyToken, deleteProperty);

module.exports = router;
