const express = require("express");
const {
    createEmailGroup,
    getAllEmailGroups,
    addUserToEmailGroup,
    removeUserFromEmailGroup
} = require("./emailGroupController");

const { authMiddleware, isAdmin } = require("./userMiddleware");

const router = express.Router();

// ✅ Create an Email Group (Admins & Super Admins Only)
router.post("/create", authMiddleware, isAdmin, createEmailGroup);

// ✅ Get All Email Groups (Admins & Super Admins Only)
router.get("/all", authMiddleware, isAdmin, getAllEmailGroups);

// ✅ Add User to Email Group (Admins & Super Admins Only)
router.post("/add-user", authMiddleware, isAdmin, addUserToEmailGroup);

// ✅ Remove User from Email Group (Admins & Super Admins Only)
router.delete("/remove-user", authMiddleware, isAdmin, removeUserFromEmailGroup);

module.exports = router;
