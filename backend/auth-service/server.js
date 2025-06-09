const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const RedisStore = require("connect-redis")(session); // ✅ No `.default` needed
const redis = require("redis");
const passport = require("passport");

const authRoutes = require("./authRoutes");
const azureAuthRoutes = require("./azureAuthRoutes");
require("./passport-azure-config");

dotenv.config();

const app = express();
const PORT = process.env.AUTH_PORT || 5001;

// ✅ Redis v3 style client
const redisClient = redis.createClient();

redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/auth", azureAuthRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Auth Service running on port ${PORT}`);
});
