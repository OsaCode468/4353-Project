const express = require('express');
const router = express.Router();
const Pricing = require('./pricingModule');
const pg = new Pricing();
const db = require('../connection'); // Import your database connection 

// Assumming there is a function in the database module to fetch the delivery address
router.get('/:id', async (req, res) => {
    try {
        const client = await db.connect()
        const id = req.params.id
        const q = await client.query("select * from fuelquotes where user_id = $1", [id])
        // Modify the SQL query to select the delivery address from the 'users' table
        // Assuming 'address' is the column name where the address is stored in the 'users' table
        return res.status(200).json({ "deliveryAddress": q.rows });
    } catch (error) {
        console.error('Error fetching delivery address:', error);
        throw new Error('Failed to fetch delivery address from the database');
    }
})





router.post('/', async (req, res) => {
    const client = await db.connect()
    const { gallons, deliveryDate, deliveryAddress, userName } = req.body;

    if (!gallons || isNaN(gallons)) {
        return res.status(400).json({ error: 'Gallons requested must be a numeric value' });
    }

    if (!deliveryDate) {
        return res.status(400).json({ error: 'Delivery date is required' });
    }

    try {
        const q = await client.query('SELECT id from users where username = $1', [userName])
        console.log(q)
        const id = q.rows[0].id
        console.log(id)
        // Fetch delivery address from the database
        // const deliveryAddress = await getDeliveryAddressFromDatabase();

        // Calculate total price and get price per gallon
        const totalPrice = 10;
        const ppg = 8;

        const postQuery = await client.query('insert into fuelquotes(user_id, gallons_requested, delivery_address, delivery_date, price_per_gallon, total_amount_due) values($1,$2,$3,$4,$5,$6)', [id, gallons, deliveryAddress, deliveryDate, ppg, totalPrice])
        // Construct the fuel quote object
        // const fuelQuote = { gallons: parseFloat(gallons), deliveryAddress, deliveryDate, totalPrice, ppg };

        // console.log(fuelQuote);

        // Send the fuel quote response to the frontend
        res.status(200).json({ message: 'Fuel quote saved successfully' });
    } catch (error) {
        console.error('Error saving fuel quote:', error);
        res.status(500).json({ 'error': error });
    }
});

module.exports = router;









// const Pricing = require('./pricingModule')
// const pg = new Pricing();
// const express = require('express');
// const router = express.Router();

// const fuelQuotes = [];

// router.post('/', (req, res) => {
//     const { gallons, deliveryDate } = req.body;

//     if (!gallons || isNaN(gallons)) {
//         return res.status(400).json({ error: 'Gallons requested must be a numeric value' });
//     }

//     if (!deliveryDate) {
//         return res.status(400).json({ error: 'Delivery date is required' });
//     }


//     const totalPrice = pg.calculateTotalPrice;
//     const ppg = pg.getPricePerGallon;

//     const fuelQuote = { gallons: parseFloat(gallons), deliveryDate, totalPrice, ppg };

//     console.log(fuelQuote)

//     fuelQuotes.push(fuelQuote);

//     res.status(200).json({ message: 'Fuel quote saved successfully', fuelQuote });
// });

// module.exports = router;








// // const express = require("express")
// // const router = express.Router()

// // router.get("/", (req, res) => {
// //     res.send("Hey fuel")
// // })

// // module.exports = router