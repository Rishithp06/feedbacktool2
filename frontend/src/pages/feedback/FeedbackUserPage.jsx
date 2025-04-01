// src/pages/feedback/FeedbackUserPage.jsx
import React, { useEffect, useState } from "react";
import FeedbackService from "../../services/FeedbackService";
import TeamService from "../../services/TeamService";

const FeedbackUserPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    teamId: "",
    recipient_id: "",
    feedback_type: "positive",
    message: "",
    isAnonymous: false,
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fb, ts] = await Promise.all([
          FeedbackService.getReceivedFeedback(),
          TeamService.getAllTeams(),
        ]);
        setFeedbacks(Array.isArray(fb) ? fb : []);
        setTeams(Array.isArray(ts) ? ts : []);
      } catch (err) {
        console.error("Error loading data", err);
        setError("Error loading data. Check your connection.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!form.teamId) return setUsers([]);
      try {
        const res = await TeamService.getTeamMembers(form.teamId);
        setUsers(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Error loading team members", err);
        setUsers([]);
      }
    };
    fetchTeamMembers();
  }, [form.teamId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await FeedbackService.giveFeedback(form);
      setMessage(res.message);
      setForm({ ...form, message: "" });
    } catch (err) {
      setError("Error submitting feedback.");
    }
  };

  const markAsRead = async (id) => {
    await FeedbackService.markAsRead(id);
    const updated = await FeedbackService.getReceivedFeedback();
    setFeedbacks(Array.isArray(updated) ? updated : []);
  };

  return (
    <div className="container">
      <h2>Give Feedback</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <label>Team:</label>
        <select name="teamId" value={form.teamId} onChange={handleChange} required>
          <option value="">-- Select Team --</option>
          {teams.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <label>Recipient:</label>
        <select name="recipient_id" value={form.recipient_id} onChange={handleChange} required>
          <option value="">-- Select User from Team --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
          ))}
        </select>

        <label>Type:</label>
        <select name="feedback_type" value={form.feedback_type} onChange={handleChange}>
          <option value="positive">Positive</option>
          <option value="improvement">Improvement</option>
        </select>

        <label>Message:</label>
        <textarea name="message" value={form.message} onChange={handleChange} required />

        <label>
          <input type="checkbox" name="isAnonymous" checked={form.isAnonymous} onChange={handleChange} />
          Submit Anonymously
        </label>

        <button type="submit">Submit Feedback</button>
      </form>

      <h2>Received Feedback</h2>
      {feedbacks.length === 0 ? (
        <p>No feedback received yet.</p>
      ) : (
        <ul>
          {feedbacks.map((fb) => (
            <li key={fb.id} style={{ marginBottom: "1rem" }}>
              <strong>{fb.feedback_type.toUpperCase()}</strong> — {fb.message}
              <br />
              Anonymous: {fb.is_anonymous ? "Yes" : "No"}
              {!fb.is_anonymous && fb.sender_name && (
                <span> | From: {fb.sender_name} ({fb.sender_email})</span>
              )}
              <br />
              Read: {fb.is_read ? "✅" : "❌"}
              {!fb.is_read && (
                <button onClick={() => markAsRead(fb.id)} style={{ marginLeft: "1rem" }}>
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeedbackUserPage;
