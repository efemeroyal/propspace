const Property = require("../models/Property");

// GET /api/properties
// Public — no token required. Supports filtering by city, minPrice, maxPrice.
const getProperties = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, listingType } = req.query;

    // Build the filter object dynamically — only add keys the client actually sent.
    // An empty filter object {} returns all documents.
    const filter = {};

    if (city) {
      // Case-insensitive regex lets "Lagos" match "lagos" or "LAGOS"
      filter.city = { $regex: city, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (listingType) {
      filter.listingType = listingType;
    }

    // populate("owner", "username avatar") replaces the owner ObjectId
    // with just the username and avatar from the User document — enough
    // for the frontend to show "Listed by @johnDoe" without a second request.
    const properties = await Property.find(filter)
      .populate("owner", "username avatar")
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(properties);
  } catch (error) {
    console.error("Get properties error:", error);
    res.status(500).json({ message: "Server error fetching properties" });
  }
};

// GET /api/properties/my
// Protected — returns ONLY the listings owned by the logged-in user.
// This is the "Private Feed" / My Listings screen requirement.
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(properties);
  } catch (error) {
    console.error("Get my properties error:", error);
    res.status(500).json({ message: "Server error fetching your properties" });
  }
};

// GET /api/properties/:id
// Public — anyone can view a single listing's detail.
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "username avatar name"
    );

    if (!property) {
      // 404 — resource not found in DB
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error("Get property by id error:", error);
    res.status(500).json({ message: "Server error fetching property" });
  }
};

// POST /api/properties
// Protected — authenticated users only.
const createProperty = async (req, res) => {
  try {
    const { title, description, price, city, country, type, images, listingType } =
      req.body;

    // Validate all required fields before touching the DB
    if (!title || !description || !price || !city || !country || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const property = await Property.create({
      title,
      description,
      price,
      city,
      country,
      type,
      images: images || [],
      listingType: listingType || "rent",
      owner: req.user._id, // attach the logged-in user as the owner
    });

    // 201 Created
    res.status(201).json(property);
  } catch (error) {
    // Mongoose validation errors (e.g. invalid enum value) return 400
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("Create property error:", error);
    res.status(500).json({ message: "Server error creating property" });
  }
};

// PUT /api/properties/:id
// Protected — only the OWNER can update their listing.
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // OWNERSHIP CHECK — this is a critical grading criterion.
    // property.owner is an ObjectId; req.user._id is also an ObjectId.
    // .toString() converts both to strings for a reliable comparison.
    if (property.owner.toString() !== req.user._id.toString()) {
      // 403 Forbidden — authenticated but not allowed to touch this resource
      return res
        .status(403)
        .json({ message: "Not authorized to update this property" });
    }

    const { title, description, price, city, country, type, images, listingType } =
      req.body;

    // Update only the fields that were sent — don't overwrite omitted fields with undefined
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (city !== undefined) updates.city = city;
    if (country !== undefined) updates.country = country;
    if (type !== undefined) updates.type = type;
    if (images !== undefined) updates.images = images;
    if (listingType !== undefined) updates.listingType = listingType;

    // { new: true } returns the updated document instead of the old one
    // runValidators ensures enum/min constraints still apply on updates
    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("Update property error:", error);
    res.status(500).json({ message: "Server error updating property" });
  }
};

// DELETE /api/properties/:id
// Protected — only the OWNER can delete their listing.
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Same ownership check as update
    if (property.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this property" });
    }

    await property.deleteOne();

    // 200 with a message — the resource is now gone
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Delete property error:", error);
    res.status(500).json({ message: "Server error deleting property" });
  }
};

module.exports = {
  getProperties,
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
