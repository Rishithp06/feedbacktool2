// src/pages/feedback/SchedulePeriodicFeedbackPage.jsx
import React, { useState, useEffect } from "react";
import FeedbackPeriodicService from "../../services/FeedbackPeriodicService";
import TeamService from "../../services/TeamService";

const SchedulePeriodicFeedbackPage = () => {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    teamId: "",
    periodic_type: "daily",
    time: "", // New: use time only (HH:mm)
    day_of_week: "", // Only for weekly
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await TeamService.getAllTeams();
        setTeams(Array.isArray(res) ? res : []);
      } catch {
        setError("Failed to load teams.");
      }
    };
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const payload = {
      teamId: form.teamId,
      periodic_type: form.periodic_type,
      time: form.time,
      day_of_week: form.periodic_type === "weekly" ? form.day_of_week : null,
    };

    try {
      const res = await FeedbackPeriodicService.createSchedule(payload);
      if (res?.message?.includes("success")) {
        setMessage(res.message);
        setForm({
          teamId: "",
          periodic_type: "daily",
          time: "",
          day_of_week: "",
        });
      } else {
        setError(res.message || "Failed to create schedule.");
      }
    } catch {
      setError("Error creating periodic schedule.");
    }
  };

  return (
    <div className="container">
      <h2>Schedule Periodic Feedback</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Team:</label>
        <select name="teamId" value={form.teamId} onChange={handleChange} required>
          <option value="">-- Select Team --</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <label>Schedule Type:</label>
        <select name="periodic_type" value={form.periodic_type} onChange={handleChange}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        {form.periodic_type === "weekly" && (
          <>
            <label>Day of Week:</label>
            <select name="day_of_week" value={form.day_of_week} onChange={handleChange} required>
              <option value="">-- Select Day --</option>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </>
        )}

        <label>Time of Day (24h):</label>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
        />

        <button type="submit" style={{ marginTop: "1rem" }}>Schedule</button>
      </form>
    </div>
  );
};

export default SchedulePeriodicFeedbackPage;
