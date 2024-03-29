const express = require('express');
const router = express.Router();

// Sample array acting as a database
const fuelQuotes = [];

router.post('/', (req, res) => {
    const { gallons, deliveryDate } = req.body;

    // Validate form data
    if (!gallons || isNaN(gallons)) {
        return res.status(400).json({ error: 'Gallons requested must be a numeric value' });
    }

    if (!deliveryDate) {
        return res.status(400).json({ error: 'Delivery date is required' });
    }

    // Calculate total amount due (just a placeholder, replace with actual logic)
    const totalPrice = parseFloat(gallons) * 3.25; // Sample price, replace with actual logic

    // Prepare fuel quote object
    const fuelQuote = {
        gallons: parseFloat(gallons),
        deliveryDate,
        totalPrice,
    };

    console.log(req.body)

    // Save fuel quote to database
    fuelQuotes.push(fuelQuote);

    // Return success response
    res.status(200).json({ message: 'Fuel quote saved successfully', fuelQuote });
});

module.exports = router;








// const express = require("express")
// const router = express.Router()

// router.get("/", (req, res) => {
//     res.send("Hey fuel")
// })

// module.exports = router