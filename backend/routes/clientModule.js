const express = require("express");
const router = express.Router();
const ClientProfile = require("../models/ClientProfile"); // Assuming you have a model like the one described

// Middleware for validation
const validateClientProfile = (req, res, next) => {
    const { fullName, address1, address2, city, state, zipcode } = req.body;
    let errors = [];
  
    if (!fullName || fullName.length > 50) errors.push("Full name must be between 1 and 50 characters long.");
    if (!address1 || address1.length > 100) errors.push("Address 1 must be between 1 and 100 characters long.");
    if (address2 && address2.length > 100) errors.push("Address 2 must not exceed 100 characters.");
    if (!city || city.length > 100) errors.push("City must be between 1 and 100 characters long.");
    if (!state || state.length !== 2) errors.push("State must be exactly 2 characters long.");
    if (!zipcode || !zipcode.match(/^\d{5}(-\d{4})?$/)) errors.push("Zipcode must be a valid 5 or 9 digit code.");
  
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation error in one or more fields.", errors });
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
