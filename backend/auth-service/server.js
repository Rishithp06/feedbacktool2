const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./authRoutes");

dotenv.config();

const app = express();
const PORT = process.env.AUTH_PORT || 5001;

app.use(express.json());
app.use(cors());

// Authentication Routes
app.use("/auth", authRoutes);

app.listen(PORT, () => console.log(`🚀 Auth Service running on port ${PORT}`));
