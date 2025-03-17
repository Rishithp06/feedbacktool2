const express = require("express");
const {
    getProfile,
    getAllUsers,
    updateUser,
    deleteUser
} = require("./userController");

const { authMiddleware, isAdmin } = require("./userMiddleware");

const router = express.Router();

// ✅ Get Profile (Any Authenticated User)
router.get("/profile", authMiddleware, getProfile);

// ✅ Get All Users (Only Admins & Super Admins)
router.get("/all", authMiddleware, isAdmin, getAllUsers);

// ✅ Update User Info (Users can update themselves, Admins can update others)
router.put("/update/:id?", authMiddleware, updateUser);

// ✅ Delete User (Only Admins & Super Admins)
router.delete("/delete/:id", authMiddleware, isAdmin, deleteUser);

module.exports = router;
