const express = require("express");
const router = express.Router();
const ClientProfile = require("../models/ClientProfile"); // Assuming you have a model like the one described

// Middleware for validation
const validateClientProfile = (req, res, next) => {
  const { fullName, address1, city, state, zipcode } = req.body;
  if (!fullName || !address1 || !city || !state || !zipcode) {
    return res.status(400).json({ message: "All required fields must be filled." });
  }
  if (fullName.length > 50 || address1.length > 100 || (req.body.address2 && req.body.address2.length > 100) || city.length > 100 || state.length !== 2 || !zipcode.match(/^\d{5}(-\d{4})?$/)) {
    return res.status(400).json({ message: "Validation error in one or more fields." });
  }
  next();
};

// GET route to fetch a client profile by ID
router.get("/:id", async (req, res) => {
  try {
    const profile = await ClientProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found." });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST route to create a new client profile
router.post("/", validateClientProfile, async (req, res) => {
  try {
    const { fullName, address1, address2, city, state, zipcode } = req.body;
    const newProfile = new ClientProfile({ fullName, address1, address2, city, state, zipcode });
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(500).json({ message: "Server error while creating profile." });
  }
});

// PUT route to update an existing client profile
router.put("/:id", validateClientProfile, async (req, res) => {
  try {
    const updatedProfile = await ClientProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found." });
    }
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: "Server error while updating profile." });
  }
});

module.exports = router;
