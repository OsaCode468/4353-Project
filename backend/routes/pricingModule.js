const express = require("express")
const router = express.Router()
const pool = require("../connection")

// // POST route for pricing
// router.post('/api/pricing', async (req, res) => {
//     try {
//         const { gallons } = req.body;
//         const pricing = new Pricing();
//         const suggestedPrice = pricing.getPricePerGallon();
//         const totalPrice = pricing.calculateTotalPrice(gallons);

//         res.status(200).json({
//             suggestedPrice,
//             totalAmount: totalPrice
//         });
//     } catch (error) {
//         console.error('Error processing pricing:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });






router.post('/', async (req, res) => {
    const client = await db.connect()
    const { gallons, deliveryDate, deliveryAddress, userName } = req.body;
    console.log(gallons, userName)
    const gallonsNumber = parseFloat(gallons);
    //ADD DELIVERY ADDRESS QUERY
    if (!gallonsNumber || isNaN(gallonsNumber)) {
        return res.status(400).json({ error: 'Gallons requested must be a numeric value' });
    }

    if (!deliveryDate) {
        return res.status(400).json({ error: 'Delivery date is required' });
    }

    try {
        const q = await client.query('SELECT id from users where username = $1', [userName])
        console.log("this is the " + q)
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

router.get("/getID/:username", async (req, res) => {
    try {
        const username = req.params.username;
        const client = await pool.connect();
        const query = 'SELECT id FROM users WHERE username = $1';
        const result = await client.query(query, [username]);
        const id = result.rows[0].id;
        const address = 'SELECT address1, state FROM client_profiles WHERE user_id = $1';
        const ress = await client.query(address, [id]);
        //console.log(id);

        client.release();

        res.status(200).json({ 'add': ress.rows[0].address1, 'state': ress.rows[0].state });
    } catch (error) {
        console.log('Error retrieving id:', error);
        res.status(500).send('Internal Server Error');
    }
})












router.get("/checkCustomer/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const client = await pool.connect();
        const query = 'SELECT COUNT(*) FROM fuelquotes WHERE user_id = $1';
        const result = await client.query(query, [id]);

        //console.log(result.rows[0].count);
        const count = result.rows[0].count

        client.release();

        res.status(200).send({ mssg: "Got count", count });
    } catch (error) {
        console.log('Error retrieving previous customer history:', error);
        res.status(500).send('Internal Server Error');
    }
})

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const client = await pool.connect();
        const query = 'SELECT * FROM fuelquotes WHERE user_id = $1';
        const result = await client.query(query, [id]);
        const fuelQuoteHistoryData = result.rows;
        //console.log(fuelQuoteHistoryData);

        client.release();

        res.status(200).send({ mssg: "Get all fuel quote history", fuelQuoteHistoryData });
    } catch (error) {
        console.log('Error retrieving fuel quote history:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router









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