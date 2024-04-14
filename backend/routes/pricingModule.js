const express = require('express');
const router = express.Router();
const db = require('../connection');




router.get('/pricePerGallon/:id', async (req, res) => {
    try {
        const client = await db.connect()
        const id = req.params.id
        const q = await client.query("select * from fuelquotes where user_id = $1", [id])

        return res.status(200).json({ "pricePerGallon": q.rows });
    } catch (error) {
        console.error('Error fetching delivery address:', error);
        throw new Error('Failed to fetch delivery address from the database');
    }
})

module.exports = router;

