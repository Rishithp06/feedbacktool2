const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "Access Denied: No Token Provided" });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified; // Attach user data to request
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

// Middleware to check if the user is an Admin or Super Admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
        return res.status(403).json({ message: "Access Denied: Requires Admin or Super Admin Role" });
    }
    next();
};

// Middleware to check if the user is a Super Admin
const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== "super_admin") {
        return res.status(403).json({ message: "Access Denied: Requires Super Admin Role" });
    }
    next();
};

module.exports = { authMiddleware, isAdmin, isSuperAdmin };
