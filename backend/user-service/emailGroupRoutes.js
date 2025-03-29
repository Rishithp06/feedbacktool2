const express = require("express");
const {
    createEmailGroup,
    getAllEmailGroups,
    addUserToEmailGroup,
    removeUserFromEmailGroup,getEmailGroupMembers,deleteEmailGroup
} = require("./emailGroupController");

const { authMiddleware, isAdmin } = require("./userMiddleware");

const router = express.Router();

// ✅ Create an Email Group (Admins & Super Admins Only)
router.post("/create", authMiddleware, isAdmin, createEmailGroup);
router.delete("/delete/:groupId", authMiddleware, isAdmin, deleteEmailGroup);

// ✅ Get All Email Groups (Admins & Super Admins Only)
router.get("/all", authMiddleware, isAdmin, getAllEmailGroups);

// ✅ Add User to Email Group (Admins & Super Admins Only)
router.post("/add-user", authMiddleware, isAdmin, addUserToEmailGroup);

// ✅ Remove User from Email Group (Admins & Super Admins Only)
router.delete("/remove-user", authMiddleware, isAdmin, removeUserFromEmailGroup);
router.get("/members/:groupName", authMiddleware, isAdmin, getEmailGroupMembers);

module.exports = router;
