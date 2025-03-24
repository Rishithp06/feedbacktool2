const express = require("express");
const {
    giveFeedback,
    scheduleFeedback,
    getScheduledFeedback,
    editScheduledFeedback,
    deleteScheduledFeedback,
    getReceivedFeedback,
    getAllFeedback,
    markFeedbackAsRead,
} = require("./feedbackController");

const { authMiddleware, isAdmin, isSuperAdmin } = require("./feedbackMiddleware");

const router = express.Router();

// ✅ Submit Feedback (Authenticated Users)
router.post("/give", authMiddleware, giveFeedback);

// ✅ Schedule Feedback Delivery (Admins & Super Admins Only)
router.post("/schedule", authMiddleware, isAdmin, scheduleFeedback);

// ✅ View All Scheduled Feedback (Admins & Super Admins Only)
router.get("/scheduled", authMiddleware, isAdmin, getScheduledFeedback);

// ✅ Edit a Scheduled Feedback (Admins & Super Admins Only)
router.put("/schedule/:id", authMiddleware, isAdmin, editScheduledFeedback);

// ✅ Delete a Scheduled Feedback (Admins & Super Admins Only)
router.delete("/schedule/:id", authMiddleware, isAdmin, deleteScheduledFeedback);

// ✅ View Received Feedback (Users)
router.get("/received", authMiddleware, getReceivedFeedback);

// ✅ Super Admin: View All Feedback (Sender & Recipient Info)
router.get("/all", authMiddleware, isSuperAdmin, getAllFeedback);

// ✅ Mark Feedback as Read (Users)
router.put("/mark-read/:id", authMiddleware, markFeedbackAsRead);

module.exports = router;
