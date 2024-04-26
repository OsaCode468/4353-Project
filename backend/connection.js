const pg = require('pg')

const client = new pg.Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "Submarine-123",
    database: "fuelrateweb"
})

module.exports = client