require('dotenv').config()

const cors = require('cors')
const express = require('express')
const app = express()
app.use(express.json())
app.use(cors())



const loginRoutes = require("./routes/login")
const clientModuleRoutes = require("./routes/clientModule")
const pricingRoutes = require("./routes/pricingModule")
const fuelRoutes = require("./routes/fuelQuoteModule")
const fuelHistoryRoutes = require("./routes/fuelQuoteHistoryModule")

app.get("/", (req, res) => {
    res.send("hi")
})

app.use("/api/login", loginRoutes)
app.use("/api/clientmodule", clientModuleRoutes)
app.use("/api/pricing", pricingRoutes)
app.use("/api/fuelquotemodule", fuelRoutes)
app.use("/api/fuelQuoteHistory", fuelHistoryRoutes)


app.listen(process.env.PORT, () => {
    console.log('listening on port 4000')
})

