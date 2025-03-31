const cron = require("node-cron");
const pool = require("./db");
const { sendFeedbackEmail } = require("./emailService");
const moment = require("moment-timezone");

const processScheduledFeedback = async () => {
    try {
        const nowIST = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

        // ✅ Get All Scheduled Feedback Due for Delivery
        const scheduledFeedback = await pool.query(
            "SELECT * FROM feedback_schedule WHERE scheduled_at <= $1",
            [nowIST]
        );

        for (let schedule of scheduledFeedback.rows) {
            const teamMembers = await pool.query(
                "SELECT user_id FROM team_members WHERE team_id = $1",
                [schedule.team_id]
            );

            for (let member of teamMembers.rows) {
                const feedbacks = await pool.query(
                    "SELECT * FROM feedback WHERE recipient_id = $1 AND team_id = $2 AND is_sent = FALSE",
                    [member.user_id, schedule.team_id]
                );

                for (let feedback of feedbacks.rows) {
                    await sendFeedbackEmail(feedback);

                    await pool.query(
                        "UPDATE feedback SET is_sent = TRUE, email_sent = TRUE WHERE id = $1",
                        [feedback.id]
                    );
                }
            }

            // ✅ Only one-time schedules supported → delete after processing
            await pool.query("DELETE FROM feedback_schedule WHERE id = $1", [schedule.id]);
        }
    } catch (error) {
        console.error("❌ Error processing scheduled feedback:", error.message);
    }
};

// ✅ Cron Job: Run every minute
cron.schedule("* * * * *", async () => {
    console.log(`🔄 Checking for scheduled feedback at ${moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")} (IST)`);
    await processScheduledFeedback();
});

module.exports = { processScheduledFeedback };
