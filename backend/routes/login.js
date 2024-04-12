const express = require('express');
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require("../connection")


const dummyuser = [];
const dummypass = [];



router.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ "err": "all fields must be filled" });
    }
    if (!dummyuser.includes(username)) {
        return res.status(400).json({ "err": "username does not exist" });
    }
    if (!dummypass.includes(password)) {
        return res.status(400).json({ "err": "password does not exist" });
    }
    // console.log(`success ${username} and ${password}`);
    res.status(200).json({ "jsonwebtoken": 5667 });
});

/*router.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ "err": "all fields must be filled" });
    }
    const client = await pool.connect()
    const userExists = await client.query('SELECT COUNT(*) FROM users WHERE username = $1', [username])
    if (parseInt(userExists.rows[0]?.count) > 0){
        throw Error("Username already in use")
    } 


    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    try {
        statement = await client.query(`INSERT INTO users (username, password) VALUES($1, $2)`, [username, hash]);
        console.log("User inserted successfully:", statement);
        const _id = await client.query("SELECT id FROM users WHERE username = $1", [username])
        const id = _id.rows[0]?.id
        const token = jwt.sign({id}, proces.env.SECRET, {expiresIn: '3d'})
    } catch (error) {
        console.error("Error inserting user:", error);
        return res.status(500).json({ "err": "Internal server error" });
    } finally {
        client.release()
    }
    dummyuser.push(username);
    dummypass.push(hash); // Store hashed password

    // console.log(dummyuser);

    return res.status(200).json({"statement": statement});
});*/

module.exports = router;
