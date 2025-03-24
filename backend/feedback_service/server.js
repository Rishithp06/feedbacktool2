const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const pool = require("./db");
const feedbackRoutes = require("./feedbackRoutes");
const { processScheduledFeedback } = require("./cronJobs");

// ✅ Load environment variables
dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Health Check API
app.get("/", (req, res) => {
    res.send("🚀 Feedback Service is Running!");
});

// ✅ Load Feedback Routes
app.use("/feedback", feedbackRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5003;
app.listen(PORT, async () => {
    console.log(`🚀 Feedback Service running on port ${PORT}`);
    console.log("✅ Connecting to PostgreSQL...");

    try {
        await pool.connect();
        console.log("✅ Connected to PostgreSQL");

        // ✅ Run Cron Jobs to Process Scheduled Feedback
        console.log("🔄 Initializing Scheduled Feedback Processing...");
        processScheduledFeedback();
    } catch (error) {
        console.error("❌ Database Connection Error:", error.message);
    }
});

// ✅ Global Error Handling (Prevents Server Crash)
app.use((err, req, res, next) => {
    console.error("❌ Unexpected Server Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});
