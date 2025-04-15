const cron = require("node-cron");
const pool = require("./db");
const { sendFeedbackEmail } = require("./emailService");
const moment = require("moment-timezone");
const { decryptMessage } = require("./encryption"); // Import decryption function

const processPeriodicFeedback = async () => {
  try {
    const nowIST = moment().tz("Asia/Kolkata");

    const result = await pool.query(
      "SELECT * FROM feedback_schedule WHERE schedule_type = 'periodic'"
    );

    for (const schedule of result.rows) {
      const scheduledTime = moment(schedule.scheduled_at).tz("Asia/Kolkata");

      // ✅ Skip if the schedule is in the future
      if (nowIST.isBefore(scheduledTime)) continue;

      // ✅ Get team members
      const members = await pool.query(
        "SELECT user_id FROM team_members WHERE team_id = $1",
        [schedule.team_id]
      );

      for (const member of members.rows) {
        // ✅ Get feedbacks that were created BEFORE the current scheduled time
        const feedbacks = await pool.query(
          `SELECT * FROM feedback 
           WHERE team_id = $1 
           AND recipient_id = $2 
           AND is_sent = FALSE 
           AND scheduled_at <= $3`,
          [schedule.team_id, member.user_id, scheduledTime.format("YYYY-MM-DD HH:mm:ss")]
        );

        for (const fb of feedbacks.rows) {
          // ✅ Decrypt the feedback message
          fb.message = decryptMessage(fb.message);

          // ✅ Send the decrypted feedback via email
          await sendFeedbackEmail(fb);

          // ✅ Mark the feedback as sent
          await pool.query(
            "UPDATE feedback SET is_sent = TRUE, email_sent = TRUE WHERE id = $1",
            [fb.id]
          );
        }
      }

      // ✅ Update to next cycle
      let nextScheduled = scheduledTime.clone();

      if (schedule.periodic_type === "daily") {
        nextScheduled.add(1, "day");
      } else if (schedule.periodic_type === "weekly") {
        const days = {
          Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4,
          Friday: 5, Saturday: 6, Sunday: 7,
        };
        const targetDay = days[schedule.day_of_week];
        const today = scheduledTime.isoWeekday();
        let daysToAdd = (targetDay - today + 7) % 7 || 7;
        nextScheduled.add(daysToAdd, "days").set({
          hour: scheduledTime.hour(),
          minute: scheduledTime.minute(),
          second: 0,
        });
      } else if (schedule.periodic_type === "monthly") {
        nextScheduled.add(1, "month");
      }

      await pool.query(
        "UPDATE feedback_schedule SET scheduled_at = $1 WHERE id = $2",
        [nextScheduled.format("YYYY-MM-DD HH:mm:ss"), schedule.id]
      );
    }
  } catch (error) {
    console.error("❌ Error in periodic cron job:", error.message);
  }
};

// ✅ Run every minute
cron.schedule("* * * * *", async () => {
  console.log("⏰ Checking periodic feedback schedules...");
  await processPeriodicFeedback();
});

module.exports = { processPeriodicFeedback };