const express = require('express');
const router = express.Router();
const pool = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware to validate client profile data
function validateClientProfile(req, res, next) {
    const { fullName, address1, city, state, zipcode } = req.body;
    if (!fullName || !address1 || !city || !state || !zipcode) {
        return res.status(400).json({ error: "All required fields must be filled" });
    }
    next();
}

// Register a new user and create a client profile
router.post('/register', async (req, res) => {
    const { username, password, fullName, address1, address2, city, state, zipcode } = req.body;
    const client = await pool.connect();
    try {
        const userExists = await client.query('SELECT COUNT(*) FROM users WHERE username = $1', [username]);
        if (parseInt(userExists.rows[0].count) > 0) {
            return res.status(400).json({ error: "Username already in use" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        const result = await client.query('SELECT id FROM users WHERE username = $1', [username]);
        const userId = result.rows[0].id;
        await client.query(
            'INSERT INTO client_profiles (user_id, full_name, address1, address2, city, state, zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [userId, fullName, address1, address2, city, state, zipcode]
        );
        const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: '3d' });
        res.status(201).json({ username, token });
    } catch (error) {
        console.error('Error in registering user:', error);
        res.status(500).json({ error: "Database error during registration" });
    } finally {
        client.release();
    }
});

// POST route to create a new client profile for an existing user
router.post("/", validateClientProfile, async (req, res) => {
    const client = await pool.connect();
    const { userId, fullName, address1, address2, city, state, zipcode } = req.body;
    try {
        const result = await client.query(
            "INSERT INTO client_profiles (user_id, full_name, address1, address2, city, state, zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [userId, fullName, address1, address2, city, state, zipcode]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error saving profile:", error);
        res.status(500).json({ message: error.message });
    } finally {
        client.release();
    }
});

// Get a client profile by user ID
router.get('/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM client_profiles WHERE user_id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: "Database error" });
    } finally {
        client.release();
    }
});

// Update a client profile
router.put('/:userId', validateClientProfile, async (req, res) => {
    const { fullName, address1, address2, city, state, zipcode } = req.body;
    const userId = parseInt(req.params.userId);
    const client = await pool.connect();
    try {
        const result = await client.query(
            'UPDATE client_profiles SET full_name = $1, address1 = $2, address2 = $3, city = $4, state = $5, zipcode = $6 WHERE user_id = $7 RETURNING *',
            [fullName, address1, address2, city, state, zipcode, userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: "Database error" });
    } finally {
        client.release();
    }
});

// Delete a client profile
router.delete('/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    the client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM client_profiles WHERE user_id = $1 RETURNING *', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Profile not found to delete" });
        }
        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ error: "Database error" });
    } finally {
        client.release();
    }
});

module.exports = router;





