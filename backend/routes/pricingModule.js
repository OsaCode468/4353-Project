class Pricing {
    constructor() { }

    // Returns price per gallon
    getPricePerGallon() {
        const ratePerGallon = 30.4;
        return ratePerGallon;
    }

    // Returns total price
    calculateTotalPrice(gallons) {
        const ratePerGallon = 4.5;
        return parseFloat(gallons) * ratePerGallon;
    }
}

module.exports = Pricing;







// const express = require("express")
// const router = express.Router()

// router.get("/", (req, res) => {
//     res.send("Hello pricing")
// })

// module.exports = router