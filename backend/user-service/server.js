const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require("./userRoutes");
const teamRoutes = require("./teamRoutes");
const emailGroupRoutes = require("./emailGroupRoutes");

const app = express();
const PORT = process.env.USER_SERVICE_PORT || 5002;

app.use(express.json());
app.use(cors());

// Define Routes
app.use("/user", userRoutes);
app.use("/team", teamRoutes);
app.use("/email-group", emailGroupRoutes);

// Start the Server
app.listen(PORT, () => console.log(`🚀 User Service running on port ${PORT}`));
