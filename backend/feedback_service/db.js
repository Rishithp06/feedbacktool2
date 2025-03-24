const { Pool } = require("pg");
const dotenv = require("dotenv");

// ✅ Load environment variables
dotenv.config();

// ✅ Create PostgreSQL Connection Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// ✅ Test Connection
pool.connect()
    .then(() => console.log("✅ PostgreSQL Connected Successfully"))
    .catch((err) => console.error("❌ Database Connection Error:", err.message));

// ✅ Handle Unexpected Disconnections
pool.on("error", (err) => {
    console.error("❌ Unexpected Database Error:", err.message);
});

// ✅ Function to Check Database Connection Before Running Queries
const checkDBConnection = async () => {
    try {
        await pool.query("SELECT 1");
        console.log("✅ Database Connection Verified");
    } catch (error) {
        console.error("❌ Database Check Failed:", error.message);
    }
};

// ✅ Run a Connection Check When Starting
checkDBConnection();

module.exports = pool;
