const express = require("express");
const router = express.Router();
const client = require("../connection");  

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
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM client_profiles");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({ message: "Error fetching profiles" });
  }
});

// POST route to create a new client profile
router.post("/", validateClientProfile, async (req, res) => {
  const { fullName, address1, address2, city, state, zipcode } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO client_profiles (full_name, address1, address2, city, state, zipcode) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [fullName, address1, address2, city, state, zipcode]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ message: "Error saving profile" });
  }
});

// PUT route to update an existing client profile
router.put("/:id", validateClientProfile, async (req, res) => {
  const { id } = req.params;
  const { fullName, address1, address2, city, state, zipcode } = req.body;
  try {
    const result = await client.query(
      "UPDATE client_profiles SET full_name = $1, address1 = $2, address2 = $3, city = $4, state = $5, zipcode = $6 WHERE id = $7 RETURNING *",
      [fullName, address1, address2, city, state, zipcode, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// DELETE route to delete a client profile
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query("DELETE FROM client_profiles WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found." });
    }
    res.status(204).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Error deleting profile" });
  }
});

module.exports = router;


