const express = require("express");
const {
    registerUser,
    registerAdmin,
    registerSuperAdmin,
    login,
    forgotPassword,
    resetPassword
} = require("./authController");

const { authMiddleware } = require("./authMiddleware");

const router = express.Router();

// ✅ Public Registration Routes (Anyone can register)
router.post("/register/user", registerUser);
router.post("/register/admin", registerAdmin);
router.post("/register/super-admin", registerSuperAdmin);

// ✅ Login Route (Single for all users)
router.post("/login", login);

// ✅ Forgot Password (Sends Reset Email)
router.post("/forgot-password", forgotPassword);

// ✅ Reset Password (Uses Reset Token)
router.post("/reset-password", resetPassword);

// ✅ Protected Route (Requires JWT Token)
router.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: "Access granted!", user: req.user });
});

module.exports = router;
