const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

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
    console.log(`success ${username} and ${password}`);
    res.status(200).json({ "jsonwebtoken": 5667 });
});

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ "err": "all fields must be filled" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    dummyuser.push(username);
    dummypass.push(hash); // Store hashed password

    console.log(dummyuser);

    return res.status(200).json({ "username": username, "password": hash });
});

module.exports = router;



// const express = require('express')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

// const router = express.Router()

// const dummyuser = []
// const dummypass = []


// router.post("/login", (req, res) => {
//     const {username, password} = req.body

//     if(!username || !password){
//         return res.status(400).json({"err":"all fields must be filled"})
//     }
//     if(!dummyuser.includes(username)) {
//         return res.status(400).json({"err" : "username does not exist"})
//     }
//     if(!dummypass.includes(password)) {
//         return res.status(400).json({"err":"password does not exist"})
//     }
//     console.log(`success ${username} and ${password}`)
//     res.status(200).json({"jsonwebtoken": 5667})
// })

// router.post("/", async (req, res) => {

//     const {username, password} = req.body

//     if(!username || !password){
//         return res.status(400).json({"err": "all fields must be filled"})
//     }

//     const salt = await bcrypt.genSalt(10)
//     const hash = bcrypt.hash(password, salt)

//     dummyuser.push(username)
//     dummypass.push(password)

//     console.log(dummyuser)

//     return res.status(200).json({"username": username, "password": hash})
// })
// module.exports = { router, dummyuser, dummypass };
