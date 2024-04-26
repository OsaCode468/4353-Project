const express = require("express");
const router = express.Router();
const pool = require("../connection");

// Middleware for validation
const validateClientProfile = (req, res, next) => {
  const { fullName, address1, city, state, zipcode } = req.body;
  console.log(state)
  let errors = [];

  if (!fullName || fullName.length > 50) errors.push("Full name must be between 1 and 50 characters long.");
  if (!address1 || address1.length > 100) errors.push("Address 1 must be between 1 and 100 characters long.");
  if (req.body.address2 && req.body.address2.length > 100) errors.push("Address 2 must not exceed 100 characters.");
  if (!city || city.length > 100) errors.push("City must be between 1 and 100 characters long.");
  if (!state || state.length !== 2) errors.push("State must be exactly 2 characters long.");
  if (!zipcode) errors.push("Zipcode must be a valid 5 or 9 digit code.");

  if (errors.length > 0) {
    console.log(errors);
    return res.status(400).json({ message: "Validation error in one or more fields.", errors });
  }
  next();
};

// Helper function to get user_id from username
const getUserIdFromUsername = async (username) => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT id FROM users WHERE username = $1", [username]);
    if (result.rows.length > 0) {
      return result.rows[0].id;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

// POST route to create or update a client profile
router.post("/", validateClientProfile, async (req, res) => {
  const { username, fullName, address1, address2, city, state, zipcode } = req.body;
  let client;
  try {
    const user_id = await getUserIdFromUsername(username);
    if (!user_id) {
      return res.status(404).json({ message: "User not found." });
    }
    
    client = await pool.connect();
    const checkProfile = await client.query("SELECT id FROM client_profiles WHERE user_id = $1", [user_id]);
    if (checkProfile.rows.length > 0) {
      // Update existing profile
      const updateResult = await client.query(
        "UPDATE client_profiles SET full_name = $2, address1 = $3, address2 = $4, city = $5, state = $6, zipcode = $7 WHERE user_id = $1 RETURNING *",
        [user_id, fullName, address1, address2, city, state, zipcode]
      );
      res.json(updateResult.rows[0]);
    } else {
      // Insert new profile
      const insertResult = await client.query(
        "INSERT INTO client_profiles (user_id, full_name, address1, address2, city, state, zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [user_id, fullName, address1, address2, city, state, zipcode]
      );
      res.status(201).json(insertResult.rows[0]);
    }
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ message: "Error saving profile" });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// DELETE route to delete a client profile
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  let client;
  try {
    const user_id = await getUserIdFromUsername(username);
    if (!user_id) {
      return res.status(404).json({ message: "User not found." });
    }

    client = await pool.connect();
    const result = await client.query("DELETE FROM client_profiles WHERE id = $1 AND user_id = $2 RETURNING *", [id, user_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found or does not belong to the user." });
    }
    res.status(204).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Error deleting profile" });
  } finally {
    if (client) {
      client.release();
    }
  }
});

module.exports = router;
