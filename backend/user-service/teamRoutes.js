const express = require("express");
const {
    createTeam,
    getAllTeams,
    getTeamMembers,
    addUserToTeam,
    removeUserFromTeam,
    deleteTeam
} = require("./teamController");

const { authMiddleware, isAdmin } = require("./userMiddleware");

const router = express.Router();

// ✅ Create a Team (Admins & Super Admins Only)
router.post("/create", authMiddleware, isAdmin, createTeam);

// ✅ Get All Teams (Any Authenticated User)
router.get("/all", authMiddleware, getAllTeams);

// ✅ Get Team Members (Any Authenticated User)
router.get("/members/:teamId", authMiddleware, getTeamMembers);

// ✅ Add User to Team (Admins & Super Admins Only)
router.post("/add-user", authMiddleware, isAdmin, addUserToTeam);

// ✅ Remove User from Team (Admins & Super Admins Only)
router.delete("/remove-user", authMiddleware, isAdmin, removeUserFromTeam);

// ✅ Delete Team (Admins & Super Admins Only)
router.delete("/delete/:teamId", authMiddleware, isAdmin, deleteTeam);

module.exports = router;
