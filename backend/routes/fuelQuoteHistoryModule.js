const express = require("express")
const router = express.Router()

router.get("/:name", (req, res) => {
    const fuelQuoteHistoryData = [
        {
          gallonsRequested: 550,
          deliveryAddress: "7404 Marlborough Rd. New Kensington, PA 15068",
          deliveryDate: "2024-05-20",
          priceGallon: 3.276,
        },
        {
          gallonsRequested: 350,
          deliveryAddress: "7404 Marlborough Rd. New Kensington, PA 15068",
          deliveryDate: "2024-04-22",
          priceGallon: 3.279,
        },
        {
          gallonsRequested: 600,
          deliveryAddress: "7404 Marlborough Rd. New Kensington, PA 15068",
          deliveryDate: "2024-03-15",
          priceGallon: 3.225,
        },
      ];

    res.status(200).send({mssg: "Get all fuel quote history", fuelQuoteHistoryData})
})

module.exports = router