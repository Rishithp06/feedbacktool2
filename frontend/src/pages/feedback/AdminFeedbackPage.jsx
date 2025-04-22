// src/pages/feedback/AdminFeedbackPage.jsx
import React, { useEffect, useState } from "react";
import FeedbackService from "../../services/FeedbackService";
import TeamService from "../../services/TeamService";
import Header from "../../components/common/Header";
import "../../styles/adminfeedback.css";

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
    <>
      <Header />
      <div className="admin-feedback-main">
        <div className="admin-feedback-card">
          <h2>Admin Feedback Management</h2>

          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg">{error}</p>}

          <section>
            <h3>{editId ? "Edit Feedback Schedule" : "Schedule Feedback Delivery"}</h3>
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

              <button type="submit">{editId ? "Update Schedule" : "Schedule Now"}</button>
            </form>
          </section>

          <section>
            <h3>Scheduled Feedback List</h3>
            {scheduled.length === 0 ? (
              <p>No scheduled feedback found.</p>
            ) : (
              <ul className="schedule-list">
                {scheduled.map((item) => (
                  <li key={item.id}>
                    🏢 <strong>{item.team_id}</strong> — 📅 {item.scheduled_at_ist}
                    <div className="schedule-actions">
                      <button onClick={() => handleEdit(item)}>✏️ Edit</button>
                      <button onClick={() => handleDelete(item.id)}>❌ Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default AdminFeedbackPage;
