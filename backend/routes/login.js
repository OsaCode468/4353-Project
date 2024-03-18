const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()

router.get("/", (req, res) => {
    res.send("Hey login")
})

router.post("/", async (req, res) => {

    const {username, password} = req.body

    if(!username || !password){
        throw Error("all fields must be filled")
    }
    
    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hash(password, salt)

    return res.status(200).json({"username": username, "password": hash})
})
module.exports = router