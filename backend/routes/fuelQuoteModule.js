const express = require('express');
const router = express.Router();
// const Pricing = require('./pricingModule');
// const pg = new Pricing();
const db = require('../connection'); // Import your database connection 

const addyAndState = [];

// Assumming there is a function in the database module to fetch the delivery address
router.get('/:username', async (req, res) => {
    try {
        const client = await db.connect()
        const username = req.params.username
        const _id = await client.query('SELECT id from users where username = $1', [userName])
        console.log("this is the " + _id)
        const id = _id.rows[0].id
        console.log(id)
        const q = await client.query("select * from fuelquotes where user_id = $1", [id])
        // Modify the SQL query to select the delivery address from the 'users' table
        // Assuming 'address' is the column name where the address is stored in the 'users' table
        return res.status(200).json({ "data": q.rows });
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Failed to fetch data from the database');
    }
})
// router.get("/getID/:username", async (req, res) => {
//     try {
//         const username = req.params.username;
//         const client = await db.connect();
//         const query = 'SELECT id FROM users WHERE username = $1';
//         const result = await client.query(query, [username]);
//         if (result.rows.length === 0) {
//             client.release();
//             return res.status(404).json({ error: 'User not found' });
//         }
//         const id = result.rows[0].id;

//         const addressQuery = 'SELECT address1, state FROM client_profiles WHERE user_id = $1';
//         const addressResult = await client.query(addressQuery, [id]);
//         if (addressResult.rows.length === 0) {
//             client.release();
//             return res.status(404).json({ error: 'Address not found for user' });
//         }

//         // Add address and state to the global array
//         addyAndState.push({
//             address: addressResult.rows[0].address1,
//             state: addressResult.rows[0].state
//         });

//         client.release();

//         // Optionally send the array back in the response or just the latest entry
//         res.status(200).json(addyAndState[addyAndState.length - 1]);
//     } catch (error) {
//         console.error('Error retrieving user details:', error);
//         if (client) {
//             client.release();
//         }
//         res.status(500).send('Internal Server Error');
//     }
// });

// console.log(addyAndState)

// router.get("/getID/:username", async (req, res) => {
//     try {
//         const username = req.params.username;
//         const client = await db.connect();

//         // Query to get user ID based on username
//         const query = 'SELECT id FROM users WHERE username = $1';
//         const result = await client.query(query, [username]);
//         if (result.rows.length === 0) {
//             client.release();
//             return res.status(404).json({ error: 'User not found' });
//         }
//         const userId = result.rows[0].id;

//         // Query to get address details from client_profiles table
//         const addressQuery = 'SELECT address1, state FROM client_profiles WHERE user_id = $1';
//         const addressResult = await client.query(addressQuery, [userId]);
//         if (addressResult.rows.length === 0) {
//             client.release();
//             return res.status(404).json({ error: 'Address not found for user' });
//         }

//         // Store 'address1' and 'state' in variables
//         const userAddress = addressResult.rows[0].address1;
//         const userState = addressResult.rows[0].state;

//         console.log("hello", userAddress, userState)

//         // Release the client after usage
//         client.release();

//         // Now you can use 'userAddress' and 'userState' as needed
//         res.status(200).json({
//             address: userAddress,
//             state: userState
//         });

//     } catch (error) {
//         console.log('Error retrieving user details:', error);
//         if (client) {
//             client.release();
//         }
//         res.status(500).send('Internal Server Error');
//     }

// });

router.get("/getID/:username", async (req, res) => {
    try {
        const username = req.params.username;
        const client = await db.connect();
        const query = 'SELECT id FROM users WHERE username = $1';
        const result = await client.query(query, [username]);
        const id = result.rows[0].id;
        //const address = 'SELECT address1, state FROM client_profiles WHERE user_id = $1';
        //const ress = await client.query(address, [id]);
        //console.log(id);

        client.release();

        res.status(200).json({ 'id': id });
    } catch (error) {
        console.log('Error retrieving id:', error);
        res.status(500).send('Internal Server Error');
    }
})

router.get("/getAddress/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const client = await db.connect();
        const query = 'SELECT address1, city, state, zipcode FROM client_profiles WHERE user_id = $1';
        const result = await client.query(query, [id]);
        const address = result.rows[0].address1;
        const city = result.rows[0].city;
        const state = result.rows[0].state;
        const zipcode = result.rows[0].zipcode;
        //console.log(id);

        client.release();

        res.status(200).json({ 'address': address, 'city': city, 'state': state, 'zipcode': zipcode });
    } catch (error) {
        console.log('Error retrieving address:', error);
        res.status(500).send('Internal Server Error');
    }
})







router.post('/', async (req, res) => {
    const client = await db.connect()
    const { gallons, deliveryAddress, deliveryDate, id, priceG, totalAmount } = req.body;
    //ADD DELIVERY ADDRESS QUERY
    if (!gallons || isNaN(gallons)) {
        return res.status(400).json({ error: 'Gallons requested must be a numeric value' });
    }

    if (!deliveryDate) {
        return res.status(400).json({ error: 'Delivery date is required' });
    }

    try {

        const postQuery = await client.query('insert into fuelquotes(user_id, gallons_requested, delivery_address, delivery_date, price_per_gallon, total_amount_due) values($1,$2,$3,$4,$5,$6)', [id, gallons, deliveryAddress, deliveryDate, priceG, totalAmount])
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