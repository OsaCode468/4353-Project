const pg = require('pg')

const client = new pg.Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "sjp347312",
    database: "fuelrateweb"
})

module.exports = client