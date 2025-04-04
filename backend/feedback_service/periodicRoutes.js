const express = require("express");
const {
  createPeriodicSchedule,
  getAllPeriodicSchedules,
} = require("./periodicController");

const { authMiddleware, isAdmin } = require("./feedbackMiddleware");

const router = express.Router();

// ✅ Admin creates a periodic schedule
router.post("/schedule-periodic", authMiddleware, isAdmin, createPeriodicSchedule);

// ✅ Admin views all periodic schedules
router.get("/scheduled-periodic", authMiddleware, isAdmin, getAllPeriodicSchedules);

module.exports = router;
