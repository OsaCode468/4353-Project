const express = require("express");
const router = express.Router();

// Simulated in-memory "database" for client profiles
let clientProfiles = [];
let nextId = 1; // Start IDs at 1, increment for each new profile

// Middleware for validation
const validateClientProfile = (req, res, next) => {
  const { fullName, address1, city, state, zipcode } = req.body;
  let errors = [];

  if (!fullName || fullName.length > 50) errors.push("Full name must be between 1 and 50 characters long.");
  if (!address1 || address1.length > 100) errors.push("Address 1 must be between 1 and 100 characters long.");
  if (req.body.address2 && req.body.address2.length > 100) errors.push("Address 2 must not exceed 100 characters.");
  if (!city || city.length > 100) errors.push("City must be between 1 and 100 characters long.");
  if (!state || state.length !== 2) errors.push("State must be exactly 2 characters long.");
  if (!zipcode || !zipcode.match(/^\d{5}(-\d{4})?$/)) errors.push("Zipcode must be a valid 5 or 9 digit code.");

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation error in one or more fields.", errors });
  }
  next();
};

// GET route to fetch all client profiles
router.get("/", (req, res) => {
  res.json(clientProfiles);
});

// POST route to create a new client profile
router.post("/", validateClientProfile, (req, res) => {
  const newProfile = { id: nextId++, ...req.body }; // Assign an ID and increment nextId
  clientProfiles.push(newProfile);
  res.status(201).json(newProfile);
});

// PUT route to update an existing client profile
router.put("/:id", validateClientProfile, (req, res) => {
  const { id } = req.params;
  const index = clientProfiles.findIndex(profile => profile.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: "Profile not found." });
  }

  // Update profile in the "database"
  clientProfiles[index] = { ...clientProfiles[index], ...req.body };
  res.json(clientProfiles[index]);
});

// DELETE route to delete a client profile
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = clientProfiles.findIndex(profile => profile.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ message: "Profile not found." });
  }

  clientProfiles = clientProfiles.filter(profile => profile.id !== parseInt(id));
  res.status(204).send();
});

module.exports = router;