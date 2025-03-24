const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// ✅ Load environment variables
dotenv.config();

// ✅ Middleware to verify JWT authentication
exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "❌ Unauthorized: No token provided. Please log in." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("❌ JWT Verification Failed:", err.message);
            return res.status(403).json({ message: "❌ Forbidden: Invalid or expired token." });
        }
        req.user = user;
        next();
    });
};

// ✅ Middleware to check if user is an Admin
exports.isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "❌ Unauthorized: Please log in." });
    }

    const role = req.user.role.toLowerCase(); // Ensure case-insensitivity
    if (role !== "admin" && role !== "super_admin") {
        return res.status(403).json({ message: "❌ Access Denied: Requires Admin Role." });
    }
    
    next();
};

// ✅ Middleware to check if user is a Super Admin
exports.isSuperAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "❌ Unauthorized: Please log in." });
    }

    const role = req.user.role.toLowerCase(); // Ensure case-insensitivity
    if (role !== "super_admin") {
        return res.status(403).json({ message: "❌ Access Denied: Requires Super Admin Role." });
    }

    next();
};
