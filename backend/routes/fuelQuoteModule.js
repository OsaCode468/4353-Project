const Pricing = require('./pricingModule')
const pg = new Pricing();
const express = require('express');
const router = express.Router();

const fuelQuotes = [];

router.post('/', (req, res) => {
    const { gallons, deliveryDate } = req.body;

    if (!gallons || isNaN(gallons)) {
        return res.status(400).json({ error: 'Gallons requested must be a numeric value' });
    }

    if (!deliveryDate) {
        return res.status(400).json({ error: 'Delivery date is required' });
    }


    const totalPrice = pg.calculateTotalPrice;
    const ppg = pg.getPricePerGallon;

    const fuelQuote = {
        gallons: parseFloat(gallons),
        deliveryDate,
        totalPrice,
        ppg
    };

    console.log(req.body)

    fuelQuotes.push(fuelQuote);

    res.status(200).json({ message: 'Fuel quote saved successfully', fuelQuote });
});

module.exports = router;








// const express = require("express")
// const router = express.Router()

// router.get("/", (req, res) => {
//     res.send("Hey fuel")
// })

// module.exports = router