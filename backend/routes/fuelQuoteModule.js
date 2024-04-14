const express = require('express');
const router = express.Router();
const db = require('../connection');

// fetches the delivery address
router.get('/deliveryAddress/:id', async (req, res) => {
    try {
        const client = await db.connect()
        const id = req.params.id
        const q = await client.query("select * from fuelquotes where user_id = $1", [id])

        return res.status(200).json({ "deliveryAddress": q.rows });
    } catch (error) {
        console.error('Error fetching delivery address:', error);
        throw new Error('Failed to fetch delivery address from the database');
    }
})





router.post('/', async (req, res) => {
    const client = await db.connect()
    const { gallons, deliveryDate, deliveryAddress } = req.body;

    const userName = 'suhaib_irfan';

    if (!gallons || isNaN(gallons)) {
        return res.status(400).json({ error: 'Gallons requested must be a numeric value' });
    }

    if (!deliveryDate) {
        return res.status(400).json({ error: 'Delivery date is required' });
    }

    try {
        const q = await client.query('SELECT id from users where username = $1', [userName])
        console.log("this is the " + q)
        // const id = q.rows[0].id

        // console.log(id)

        // const deliveryAddress = await getDeliveryAddressFromDatabase();

        //needed to use dummy values for these since the client module's frontend did not load when i 
        //clicked on it and thus i could not input any values for these to test it out. 
        const id = 1;
        const ppg = 3.276;
        const totalPrice = gallons * ppg;

        const postQuery = await client.query('insert into fuelquotes(user_id, gallons_requested, delivery_address, delivery_date, price_per_gallon, total_amount_due) values($1,$2,$3,$4,$5,$6)', [id, gallons, deliveryAddress, deliveryDate, ppg, totalPrice])

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




