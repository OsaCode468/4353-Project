const express = require('express')
const app = express()
const loginRoutes = require("./routes/login")
const clientModuleRoutes = require("./routes/clientModule")
const pricingRoutes = require("./routes/pricingModule")
const fuelRoutes = require("./routes/fuelQuoteModule")

app.get("/", (req, res) => {
    res.send("hi")
})

app.use("/api/login", loginRoutes)
app.use("/api/clientmodule", clientModuleRoutes)
app.use("/api/pricing", pricingRoutes)
app.use("/api/fuelQuote", fuelRoutes)

app.listen(4000, () => {
    console.log('listening on port 4000')
})