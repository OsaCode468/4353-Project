const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require("../connection")


const dummyuser = [];
const dummypass = [];



router.post("/login", async (req, res) => {

    const { username, password } = req.body;
    const client = await pool.connect()

    if (!username || !password) {
        return res.status(400).json({ "err": "all fields must be filled" });
    }
    const userExists = await client.query('SELECT COUNT(*) FROM users WHERE username = $1', [username])
    if (parseInt(userExists.rows[0]?.count) <= 0){
        return res.status(400).json({"err":"Username does not exist"})
    }

    const ress = await client.query('SELECT password FROM users WHERE username = $1', [username])
    const dbPassword = ress.rows[0]?.password
    const match = await bcrypt.compare(password, dbPassword)
    if (!match) {
        return res.status(400).json({"err":"Incorrect password"})
    }
    const _id = await client.query("SELECT id FROM users WHERE username = $1", [username])
    const id = _id.rows[0]?.id
    const token = jwt.sign({id}, process.env.SECRET, {expiresIn: '3d'})
    res.status(200).json({username, token})
    // console.log(`success ${username} and ${password}`);
});

router.post("/", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ "err": "all fields must be filled" });
    }
    const client = await pool.connect()
    const userExists = await client.query('SELECT COUNT(*) FROM users WHERE username = $1', [username])
    if (parseInt(userExists.rows[0]?.count) > 0){
        return res.status(400).json({"err":"Username already in use"})
    } 
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    try {
        statement = await client.query(`INSERT INTO users (username, password) VALUES($1, $2)`, [username, hash]); //replace with hash later
        const _id = await client.query("SELECT id FROM users WHERE username = $1", [username])
        const id = _id.rows[0]?.id
        const token = jwt.sign({id}, "YGBhNeFUN9iGuk8Hhed4qtx1thdxlOSX", {expiresIn: '3d'})
        console.log("did it")
        res.status(200).json({username, token})
    } catch (error) {
        console.error("Error inserting user:", error);
        return res.status(500).json({ "err": error });
    } finally {
        client.release()
    }
    // dummyuser.push(username);
    // dummypass.push(hash); // Store hashed password

    // // console.log(dummyuser);

    // return res.status(200).json({"statement": statement});
});

module.exports = router;
