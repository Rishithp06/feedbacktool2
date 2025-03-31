// src/pages/feedback/AdminFeedbackPage.jsx
import React, { useEffect, useState } from "react";
import FeedbackService from "../../services/FeedbackService";
import TeamService from "../../services/TeamService";
import FeedbackUserPage from "./FeedbackUserPage";

const AdminFeedbackPage = () => {
  const [teams, setTeams] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [form, setForm] = useState({
    teamId: "",
    scheduled_at: "",
    schedule_type: "specific_date"
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchScheduled = async () => {
    const res = await FeedbackService.getScheduledFeedback();
    setScheduled(Array.isArray(res) ? res : []);
  };

  useEffect(() => {
    TeamService.getAllTeams().then(setTeams);
    fetchScheduled();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = editId
        ? await FeedbackService.editSchedule(editId, form)
        : await FeedbackService.scheduleFeedback(form);

      setMessage(res.message);
      setForm({ teamId: "", scheduled_at: "", schedule_type: "specific_date" });
      setEditId(null);
      fetchScheduled();
    } catch (err) {
      setError("Failed to save schedule.");
    }
  };

  const handleEdit = (entry) => {
    setForm({
      teamId: entry.team_id,
      scheduled_at: entry.scheduled_at_ist?.slice(0, 16),
      schedule_type: "specific_date",
    });
    setEditId(entry.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;
    const res = await FeedbackService.deleteSchedule(id);
    setMessage(res.message);
    fetchScheduled();
  };

  return (
    <div className="container">
      <h2>Admin Feedback Management</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={{ marginBottom: "2rem" }}>
        <h3>{editId ? "Edit Schedule" : "Schedule Feedback Delivery"}</h3>
        <form onSubmit={handleSubmit}>
          <label>Team:</label>
          <select name="teamId" value={form.teamId} onChange={handleChange} required>
            <option value="">-- Select Team --</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>

          <label>Scheduled At:</label>
          <input
            type="datetime-local"
            name="scheduled_at"
            value={form.scheduled_at}
            onChange={handleChange}
            required
          />

          <button type="submit">{editId ? "Update" : "Schedule"}</button>
        </form>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Scheduled Feedback List</h3>
        {scheduled.length === 0 ? (
          <p>No scheduled feedback found.</p>
        ) : (
          <ul>
            {scheduled.map((item) => (
              <li key={item.id}>
                🏢 <strong>{item.team_id}</strong> — 📅 {item.scheduled_at_ist}
                <br />
                <button onClick={() => handleEdit(item)}>✏️ Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ marginLeft: "0.5rem" }}>
                  ❌ Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <hr />
      <section>
        <h3>Give Feedback</h3>
        <FeedbackUserPage />
      </section>
    </div>
  );
};

export default AdminFeedbackPage;
