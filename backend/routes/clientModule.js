const express = require("express");
const router = express.Router();
const pool = require("../connection");

// Middleware for validation
const validateClientProfile = (req, res, next) => {
  const { fullName, address1, city, state, zipcode } = req.body;
  let errors = [];

  if (!fullName || fullName.length > 50) errors.push("Full name must be between 1 and 50 characters long.");
  if (!address1 || address1.length > 100) errors.push("Address 1 must be between 1 and 100 characters long.");
  if (req.body.address2 && req.body.address2.length > 100) errors.push("Address 2 must not exceed 100 characters.");
  if (!city || city.length > 100) errors.push("City must be between 1 and 100 characters long.");
  if (!state || state.length !== 2) errors.push("State must be exactly 2 characters long.");
  if (!zipcode) errors.push("Zipcode must be a valid 5 or 9 digit code.");

  if (errors.length > 0) {
    return res.status(400).json({ message: "Validation error in one or more fields.", errors });
  }
  next();
};


// Register a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Both username and password are required." });
  }

  const client = await pool.connect();
  try {
    // Check if user already exists
    const exists = await client.query("SELECT 1 FROM users WHERE username = $1", [username]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ message: "Username already taken." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    await client.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hashedPassword]);
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  } finally {
    client.release();
  }
});

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

// POST route to create a new client profile
router.post("/", validateClientProfile, async (req, res) => {
  const { username, fullName, address1, address2, city, state, zipcode } = req.body;
  try {
    const user_id = await getUserIdFromUsername(username);
    if (!user_id) {
      return res.status(404).json({ message: "User not found." });
    }
    
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO client_profiles (user_id, full_name, address1, address2, city, state, zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [user_id, fullName, address1, address2, city, state, zipcode]
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
  const { username, fullName, address1, address2, city, state, zipcode } = req.body;
  try {
    const user_id = await getUserIdFromUsername(username);
    if (!user_id) {
      return res.status(404).json({ message: "User not found." });
    }

    const client = await pool.connect();
    const result = await client.query(
      "UPDATE client_profiles SET full_name = $1, address1 = $2, address2 = $3, city = $4, state = $5, zipcode = $6 WHERE id = $7 AND user_id = $8 RETURNING *",
      [fullName, address1, address2, city, state, zipcode, id, user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found or does not belong to the user." });
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
  const { username } = req.body;
  try {
    const user_id = await getUserIdFromUsername(username);
    if (!user_id) {
      return res.status(404).json({ message: "User not found." });
    }

    const client = await pool.connect();
    const result = await client.query("DELETE FROM client_profiles WHERE id = $1 AND user_id = $2 RETURNING *", [id, user_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found or does not belong to the user." });
    }
    res.status(204).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Error deleting profile" });
  }
});

module.exports = router;



