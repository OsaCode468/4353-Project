const express = require("express")
const router = express.Router()
const pool = require("../connection")

router.get("/getID/:username", async (req, res) => {
  try{
    const username = req.params.username;
    const client = await pool.connect();
    const query = 'SELECT id FROM users WHERE username = $1';
    const result = await client.query(query, [username]);
    const id = result.rows[0].id;

    client.release();

    res.status(200).send({ mssg: "Got customer ID", id });
  } catch (error) {
    console.log('Error retrieving id:', error);
    res.status(500).send('Internal Server Error');
  }
})

router.get("/checkCustomer/:id", async (req, res) => {
  try{
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
  try{
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