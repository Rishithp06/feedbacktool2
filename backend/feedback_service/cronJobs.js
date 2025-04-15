const cron = require("node-cron");
const pool = require("./db");
const { sendFeedbackEmail } = require("./emailService");
const moment = require("moment-timezone");
const { decryptMessage } = require("./encryption"); // Import decryption function

const processScheduledFeedback = async () => {
  try {
    const nowIST = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    // ✅ Only fetch one-time schedules
    const scheduledFeedback = await pool.query(
      "SELECT * FROM feedback_schedule WHERE scheduled_at <= $1 AND schedule_type = 'specific_date'",
      [nowIST]
    );

    for (let schedule of scheduledFeedback.rows) {
      const teamMembers = await pool.query(
        "SELECT user_id FROM team_members WHERE team_id = $1",
        [schedule.team_id]
      );

      for (let member of teamMembers.rows) {
        const feedbacks = await pool.query(
          `SELECT * FROM feedback 
           WHERE recipient_id = $1 AND team_id = $2 
           AND is_sent = FALSE 
           AND scheduled_at <= $3`,
          [member.user_id, schedule.team_id, nowIST]
        );

        for (let feedback of feedbacks.rows) {
          // ✅ Decrypt the feedback message before sending the email
          feedback.message = decryptMessage(feedback.message);

          // ✅ Send the decrypted feedback via email
          await sendFeedbackEmail(feedback);

          // ✅ Mark the feedback as sent
          await pool.query(
            "UPDATE feedback SET is_sent = TRUE, email_sent = TRUE WHERE id = $1",
            [feedback.id]
          );
        }
      }

      // ✅ Delete ONLY one-time schedule after processing
      await pool.query("DELETE FROM feedback_schedule WHERE id = $1", [schedule.id]);
    }
  } catch (error) {
    console.error("❌ Error processing scheduled feedback:", error.message);
  }
};

// ✅ Cron Job: Run every minute
cron.schedule("* * * * *", async () => {
  console.log(`🔄 Checking for one-time scheduled feedback at ${moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")} (IST)`);
  await processScheduledFeedback();
});

module.exports = { processScheduledFeedback };