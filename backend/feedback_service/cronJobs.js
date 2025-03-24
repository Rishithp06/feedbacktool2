const cron = require("node-cron");
const pool = require("./db");
const { sendFeedbackEmail } = require("./emailService");
const moment = require("moment-timezone");

// ✅ Function to Process Scheduled Feedback in IST
const processScheduledFeedback = async () => {
    try {
        const nowIST = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

        // ✅ Get All Scheduled Feedback Due for Delivery
        const scheduledFeedback = await pool.query(
            "SELECT * FROM feedback_schedule WHERE scheduled_at <= $1",
            [nowIST]
        );

        for (let schedule of scheduledFeedback.rows) {
            // ✅ Get All Team Members for the Scheduled Feedback
            const teamMembers = await pool.query(
                "SELECT user_id FROM team_members WHERE team_id = $1",
                [schedule.team_id]
            );

            for (let member of teamMembers.rows) {
                // ✅ Fetch All Unsent Feedback for This Team Member
                const feedbacks = await pool.query(
                    "SELECT * FROM feedback WHERE recipient_id = $1 AND team_id = $2 AND is_sent = FALSE",
                    [member.user_id, schedule.team_id]
                );

                for (let feedback of feedbacks.rows) {
                    // ✅ Send Feedback via Email
                    await sendFeedbackEmail(feedback);

                    // ✅ Mark Feedback as Sent
                    await pool.query(
                        "UPDATE feedback SET is_sent = TRUE, email_sent = TRUE WHERE id = $1",
                        [feedback.id]
                    );
                }
            }

            // ✅ If Periodic, Reset `scheduled_at` to Next Occurrence in IST
            if (schedule.schedule_type === "periodic") {
                let nextSendAtIST = moment().tz("Asia/Kolkata");

                if (schedule.periodic_type === "daily") {
                    nextSendAtIST.add(1, "day");
                } else if (schedule.periodic_type === "weekly") {
                    // Convert string day to number
                    const daysOfWeek = {
                        "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 7
                    };
                    const today = moment().tz("Asia/Kolkata").isoWeekday();
                    const targetDay = daysOfWeek[schedule.day_of_week];

                    let daysUntilNext = targetDay >= today ? targetDay - today : 7 - (today - targetDay);
                    nextSendAtIST.add(daysUntilNext, "days");
                } else if (schedule.periodic_type === "monthly") {
                    nextSendAtIST.add(1, "month");
                }

                await pool.query(
                    "UPDATE feedback_schedule SET scheduled_at = $1 WHERE id = $2",
                    [nextSendAtIST.format(), schedule.id]
                );
            } else {
                // ✅ If Not Periodic, Delete Schedule After Execution
                await pool.query("DELETE FROM feedback_schedule WHERE id = $1", [schedule.id]);
            }
        }
    } catch (error) {
        console.error("❌ Error processing scheduled feedback:", error.message);
    }
};

// ✅ Run Cron Job Every Minute to Check for Scheduled Feedback in IST
cron.schedule("* * * * *", async () => {
    console.log(`🔄 Checking for scheduled feedback at ${moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")} (IST)`);
    await processScheduledFeedback();
});

module.exports = { processScheduledFeedback };
