const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    res.send("Hey clientModule")
})

module.exports = router