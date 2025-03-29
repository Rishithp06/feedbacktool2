const { Pool } = require("pg");
require("dotenv").config();
require("dotenv").config();

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "feedback_systems",
    password: "rishi", 
    port: 5432,
});


pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error(" Database Connection Error", err));

module.exports = pool;
