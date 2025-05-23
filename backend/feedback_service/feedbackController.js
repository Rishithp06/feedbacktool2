const pool = require("./db");
const moment = require("moment-timezone");
const { encryptMessage, decryptMessage } = require("./encryption");

// ✅ Submit Feedback (Any Authenticated User)
exports.giveFeedback = async (req, res) => {
    const { teamId, recipient_id, feedback_type, message, isAnonymous, scheduled_at } = req.body;

    try {
        const sender_id = req.user.id; // always store sender ID


        // ✅ Clean and encrypt the feedback message
        const cleanedMessage = message.trim();
        const encryptedMessage = encryptMessage(cleanedMessage);

        // ✅ Sanity check
        if (!encryptedMessage.includes(":")) {
            return res.status(500).json({ message: "Encryption failed — malformed output." });
        }

        // ✅ Check if the team has a feedback schedule
        let teamScheduleQuery = await pool.query(
            "SELECT scheduled_at FROM feedback_schedule WHERE team_id = $1 LIMIT 1",
            [teamId]
        );

        let feedbackScheduledAt;
        if (teamScheduleQuery.rows.length > 0) {
            feedbackScheduledAt = teamScheduleQuery.rows[0].scheduled_at;
        } else {
            feedbackScheduledAt = scheduled_at;
        }

        const scheduledAtIST = moment
            .tz(feedbackScheduledAt, "Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss");

        const feedback = await pool.query(
            `INSERT INTO feedback (
                sender_id, recipient_id, team_id, feedback_type, message,
                is_anonymous, is_sent, email_sent, scheduled_at, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, FALSE, FALSE, $7, NOW() AT TIME ZONE 'Asia/Kolkata')
            RETURNING *`,
            [sender_id, recipient_id, teamId, feedback_type, encryptedMessage, isAnonymous, scheduledAtIST]
        );

        res.status(201).json({ message: "Feedback submitted successfully!", feedback: feedback.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error submitting feedback", error: error.message });
    }
};

// ✅ Schedule Feedback for a Team (Admins Only) — One-Time Only
exports.scheduleFeedback = async (req, res) => {
    const { teamId, schedule_type, scheduled_at } = req.body;

    try {
        // ✅ Convert to IST timezone
        const scheduledAtIST = moment.tz(scheduled_at, "Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

        // ✅ Only allow one one-time schedule per team
        if (schedule_type === "specific_date") {
            const exists = await pool.query(
                "SELECT id FROM feedback_schedule WHERE team_id = $1 AND schedule_type = 'specific_date'",
                [teamId]
            );

            if (exists.rows.length > 0) {
                return res.status(400).json({ message: "❌ A one-time schedule already exists for this team." });
            }
        }

        // ✅ Insert schedule
        const schedule = await pool.query(
            `INSERT INTO feedback_schedule (
                team_id, scheduled_by, schedule_type, scheduled_at, created_at
            ) VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
            [teamId, req.user.id, schedule_type, scheduledAtIST]
        );

        res.status(201).json({ message: "✅ Feedback schedule created successfully!", schedule: schedule.rows[0] });
    } catch (error) {
        console.error("Error scheduling feedback:", error.message);
        res.status(500).json({ message: "❌ Error scheduling feedback", error: error.message });
    }
};

// ✅ View Scheduled Feedback (Admins Only)
exports.getScheduledFeedback = async (req, res) => {
    try {
        const schedules = await pool.query(
            `SELECT id, team_id, scheduled_by, schedule_type,
                    scheduled_at AT TIME ZONE 'Asia/Kolkata' AS scheduled_at_ist
             FROM feedback_schedule`
        );
        res.json(schedules.rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching scheduled feedback", error: error.message });
    }
};

// ✅ Edit a Scheduled Feedback (Admins Only)
exports.editScheduledFeedback = async (req, res) => {
    const { id } = req.params;
    const { schedule_type, scheduled_at, periodic_type, day_of_week } = req.body;

    try {
        const scheduledAtIST = moment.tz(scheduled_at, "Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

        const updatedSchedule = await pool.query(
            "UPDATE feedback_schedule SET schedule_type = $1, scheduled_at = $2, periodic_type = $3, day_of_week = $4 WHERE id = $5 RETURNING *",
            [schedule_type, scheduledAtIST, periodic_type, day_of_week, id]
        );

        if (!updatedSchedule.rows.length) return res.status(404).json({ message: "Schedule not found!" });

        const { team_id } = updatedSchedule.rows[0];

        const result = await pool.query(
            "UPDATE feedback SET scheduled_at = $1 WHERE team_id = $2 AND is_sent = FALSE",
            [scheduledAtIST, team_id]
        );

        console.log("Feedback entries updated:", result.rowCount);

        res.json({ message: "Feedback schedule updated successfully!", schedule: updatedSchedule.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error updating feedback schedule", error: error.message });
    }
};

// ✅ Delete a Scheduled Feedback (Admins Only)
exports.deleteScheduledFeedback = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSchedule = await pool.query(
            "DELETE FROM feedback_schedule WHERE id = $1 RETURNING id",
            [id]
        );

        if (!deletedSchedule.rows.length) {
            return res.status(404).json({ message: "Schedule not found!" });
        }

        res.json({ message: "Feedback schedule deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting feedback schedule", error: error.message });
    }
};

// ✅ View Received Feedback (Users)
exports.getReceivedFeedback = async (req, res) => {
    try {
        const feedback = await pool.query(
            `SELECT f.id, f.message, f.feedback_type, f.is_anonymous, f.is_read, f.is_sent, f.email_sent, 
                    f.created_at AT TIME ZONE 'Asia/Kolkata' AS created_at_ist,
                    f.scheduled_at AT TIME ZONE 'Asia/Kolkata' AS scheduled_at_ist,
                    sender.name AS sender_name,
                    sender.email AS sender_email
             FROM feedback f
             LEFT JOIN users sender ON f.sender_id = sender.id
             WHERE f.recipient_id = $1 AND f.scheduled_at <= NOW() AT TIME ZONE 'Asia/Kolkata'`,
            [req.user.id]
        );

        // ✅ Decrypt feedback messages
        const decryptedFeedback = feedback.rows.map((row) => ({
            ...row,
            message: decryptMessage(row.message),
        }));

        res.json(decryptedFeedback);
    } catch (error) {
        res.status(500).json({ message: "Error fetching feedback", error: error.message });
    }
};

// ✅ Super Admin: View All Feedback (Includes Sender & Recipient Info)
exports.getAllFeedback = async (req, res) => {
    try {
        console.log("🔐 Super Admin Request by:", req.user.email, "with role:", req.user.role);

        if (req.user.role !== "super_admin") {
            console.warn("⛔ Access denied - not a super admin");
            return res.status(403).json({ message: "Access Denied: Requires Super Admin Role" });
        }

        const feedback = await pool.query(
            `SELECT f.id, f.message, f.feedback_type, f.is_anonymous,
                    f.is_read, f.is_sent, f.email_sent,
                    f.scheduled_at AT TIME ZONE 'Asia/Kolkata' AS scheduled_at_ist,
                    f.created_at AT TIME ZONE 'Asia/Kolkata' AS created_at_ist,
                    sender.name AS sender_name, sender.email AS sender_email,
                    recipient.name AS recipient_name, recipient.email AS recipient_email
             FROM feedback f
             LEFT JOIN users sender ON f.sender_id = sender.id
             INNER JOIN users recipient ON f.recipient_id = recipient.id`
        );

        console.log("✅ Feedback fetched:", feedback.rows.length, "rows");

        const decryptedFeedback = feedback.rows.map((row, index) => {
            const decrypted = decryptMessage(row.message);
            console.log(`🗝️ Decrypted [${index}]:`, decrypted);
        
            const hasSender = row.sender_name && row.sender_email;
            const trueSender = hasSender ? `${row.sender_name} (${row.sender_email})` : "[Unknown Sender]";
        
            const displaySender =
                req.user.role === "super_admin"
                    ? trueSender
                    : row.is_anonymous
                    ? "Anonymous"
                    : trueSender;
        
            return {
                ...row,
                message: decrypted,
                sender_display: displaySender,
            };
        });
        
        res.json({ feedback: decryptedFeedback });
    } catch (error) {
        console.error("❌ Error in getAllFeedback:", error.message);
        res.status(500).json({ message: "Error fetching feedback", error: error.message });
    }
};



// ✅ Mark Feedback as Read (Users)
exports.markFeedbackAsRead = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedFeedback = await pool.query(
            "UPDATE feedback SET is_read = true WHERE id = $1 AND recipient_id = $2 RETURNING *",
            [id, req.user.id]
        );

        if (!updatedFeedback.rows.length) {
            return res.status(404).json({ message: "Feedback not found!" });
        }

        res.json({ message: "Feedback marked as read!" });
    } catch (error) {
        res.status(500).json({ message: "Error marking feedback as read", error: error.message });
    }
};