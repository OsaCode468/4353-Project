const pg = require('pg')

const client = new pg.Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "sjp347312",
    database: "fuelrateweb"
})

client.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error executing query', err);
    } else {
        console.log('Connected to database at', res.rows[0].now);
    }
});

module.exports = client