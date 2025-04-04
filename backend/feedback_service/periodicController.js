const pool = require("./db");
const moment = require("moment-timezone");

// ✅ Create a Periodic Schedule (Admins Only)
function computeNextScheduledAt(type, time, dayOfWeek) {
    const now = moment().tz("Asia/Kolkata");
    const [hour, minute] = time.split(":").map(Number);
  
    let next = now.clone().set({ hour, minute, second: 0 });
  
    if (type === "daily") {
      if (next.isBefore(now)) next.add(1, "day");
    }
  
    if (type === "weekly") {
      const days = {
        Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
        Thursday: 4, Friday: 5, Saturday: 6,
      };
      const targetDay = days[dayOfWeek];
      const currentDay = next.day();
      let daysToAdd = (targetDay - currentDay + 7) % 7 || 7;
  
      if (daysToAdd === 0 && next.isBefore(now)) daysToAdd = 7;
      next.add(daysToAdd, "days");
    }
  
    if (type === "monthly") {
      if (next.isBefore(now)) next.add(1, "month");
    }
  
    return next.format("YYYY-MM-DD HH:mm:ss");
  }
  
  // ✅ Controller: Create a Periodic Schedule
  exports.createPeriodicSchedule = async (req, res) => {
    const { teamId, periodic_type, day_of_week, time } = req.body;
  
    try {
      if (!["daily", "weekly", "monthly"].includes(periodic_type)) {
        return res.status(400).json({ message: "Invalid periodic type." });
      }
  
      if (!time || (periodic_type === "weekly" && !day_of_week)) {
        return res.status(400).json({ message: "Time and/or day of week missing." });
      }
  
      // ✅ Check if a periodic schedule already exists for the team
      const check = await pool.query(
        "SELECT id FROM feedback_schedule WHERE team_id = $1 AND schedule_type = 'periodic'",
        [teamId]
      );
  
      if (check.rows.length > 0) {
        return res.status(400).json({ message: "A periodic schedule already exists for this team." });
      }
  
      const scheduledAt = computeNextScheduledAt(periodic_type, time, day_of_week);
  
      const result = await pool.query(
        `INSERT INTO feedback_schedule (
          team_id, scheduled_by, schedule_type, periodic_type, day_of_week, scheduled_at, created_at
        ) VALUES ($1, $2, 'periodic', $3, $4, $5, NOW()) RETURNING *`,
        [teamId, req.user.id, periodic_type, day_of_week || null, scheduledAt]
      );
  
      res.status(201).json({ message: "✅ Periodic schedule created!", schedule: result.rows[0] });
    } catch (error) {
      console.error("Error creating periodic schedule:", error.message);
      res.status(500).json({ message: "Failed to create schedule", error: error.message });
    }
  };
// ✅ View All Periodic Schedules (Admins)
exports.getAllPeriodicSchedules = async (req, res) => {
  try {
    const schedules = await pool.query(
      `SELECT id, team_id, scheduled_by, periodic_type, day_of_week,
              scheduled_at AT TIME ZONE 'Asia/Kolkata' AS scheduled_at_ist,
              created_at AT TIME ZONE 'Asia/Kolkata' AS created_at_ist
       FROM feedback_schedule
       WHERE schedule_type = 'periodic'`
    );

    res.json(schedules.rows);
  } catch (error) {
    console.error("Error fetching periodic schedules:", error.message);
    res.status(500).json({ message: "Failed to fetch schedules", error: error.message });
  }
};
