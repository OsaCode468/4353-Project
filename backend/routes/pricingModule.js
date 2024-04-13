const express = require('express');
const router = express.Router();
const db = require('../connection'); // Import your database connection 




router.get('/pricePerGallon/:id', async (req, res) => {
    try {
        const client = await db.connect()
        const id = req.params.id
        const q = await client.query("select * from fuelquotes where user_id = $1", [id])
        // Modify the SQL query to select the delivery address from the 'users' table
        // Assuming 'address' is the column name where the address is stored in the 'users' table
        return res.status(200).json({ "pricePerGallon": q.rows });
    } catch (error) {
        console.error('Error fetching delivery address:', error);
        throw new Error('Failed to fetch delivery address from the database');
    }
})

module.exports = router;






// class Pricing {
//     constructor() { }



//     // Returns price per gallon
//     getPricePerGallon() {
//         const ratePerGallon = 30.4;
//         return ratePerGallon;
//     }

//     // Returns total price
//     calculateTotalPrice(gallons) {
//         const ratePerGallon = 4.5;
//         return parseFloat(gallons) * ratePerGallon;
//     }
// }

// module.exports = Pricing;







// const express = require("express")
// const router = express.Router()

// router.get("/", (req, res) => {
//     res.send("Hello pricing")
// })

// module.exports = router