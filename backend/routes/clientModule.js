const express = require('express');
const router = express.Router();
const pool = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user and create a client profile
router.post('/register', async (req, res) => {
    const { username, password, fullName, address1, address2, city, state, zipcode } = req.body;

    // Connect to the database
    const client = await pool.connect();
    try {
        // Check if user already exists
        const userExists = await client.query('SELECT COUNT(*) FROM users WHERE username = $1', [username]);
        if (parseInt(userExists.rows[0].count) > 0) {
            return res.status(400).json({ "error": "Username already in use" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user into the users table
        await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

        // Retrieve the new user's ID
        const result = await client.query('SELECT id FROM users WHERE username = $1', [username]);
        const userId = result.rows[0].id;

        // Insert the client profile into the client_profiles table
        await client.query(
            'INSERT INTO client_profiles (user_id, full_name, address1, address2, city, state, zipcode) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [userId, fullName, address1, address2, city, state, zipcode]
        );

        // Generate a token
        const token = jwt.sign({ userId }, process.env.SECRET, { expiresIn: '3d' });

        // Send success response
        res.status(201).json({ username, token });
    } catch (error) {
        console.error('Error in registering user:', error);
        res.status(500).json({ "error": "Database error during registration" });
    } finally {
        client.release();
    }
});

module.exports = router;




