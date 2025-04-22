import React, { useEffect, useState } from "react";
import FeedbackService from "../services/FeedbackService";
import Header from "../components/common/Header";
import "../styles/SuperAdminDashboard.css";

const SuperAdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [senderFilter, setSenderFilter] = useState("");
  const [recipientFilter, setRecipientFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await FeedbackService.getAllFeedback();
        const arr = Array.isArray(data) ? data : [];
        setFeedbacks(arr);
        setFilteredFeedbacks(arr);
      } catch (err) {
        console.error("Error:", err);
        setError("Could not fetch feedback.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  useEffect(() => {
    let filtered = [...feedbacks];
    if (senderFilter) {
      filtered = filtered.filter(fb => fb.sender_display === senderFilter);
    }
    if (recipientFilter) {
      filtered = filtered.filter(
        fb => `${fb.recipient_name} (${fb.recipient_email})` === recipientFilter
      );
    }
    setFilteredFeedbacks(filtered);
  }, [senderFilter, recipientFilter, feedbacks]);

  const senders = [...new Set(feedbacks.map(fb => fb.sender_display))];
  const recipients = [...new Set(feedbacks.map(fb => `${fb.recipient_name} (${fb.recipient_email})`))];

  return (
    <>
      <Header />
      <div className="superadmin-dashboard">
        <div className="dashboard-header">
          <h1>⚡ Super Admin Feedback Dashboard</h1>
          <p className="subtitle">Filtered view of all feedback ever submitted</p>
        </div>

        <div className="filters">
          <div>
            <label>Sender:</label>
            <select value={senderFilter} onChange={(e) => setSenderFilter(e.target.value)}>
              <option value="">All</option>
              {senders.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Recipient:</label>
            <select value={recipientFilter} onChange={(e) => setRecipientFilter(e.target.value)}>
              <option value="">All</option>
              {recipients.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="loading-text">⏳ Loading feedback...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : filteredFeedbacks.length === 0 ? (
          <p className="empty-text">No feedback found for selected filters.</p>
        ) : (
          <div className="table-wrapper">
            <table className="feedback-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sender</th>
                  <th>Recipient</th>
                  <th>Type</th>
                  <th>Message</th>
                  <th>Anonymous</th>
                  <th>Created At</th>
                  <th>Scheduled At</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map(fb => (
                  <tr key={fb.id}>
                    <td>{fb.id}</td>
                    <td>{fb.sender_display}</td>
                    <td>{`${fb.recipient_name} (${fb.recipient_email})`}</td>
                    <td>{fb.feedback_type}</td>
                    <td>{fb.message}</td>
                    <td>{fb.is_anonymous ? "Yes" : "No"}</td>
                    <td>{new Date(fb.created_at_ist).toLocaleString()}</td>
                    <td>{new Date(fb.scheduled_at_ist).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default SuperAdminDashboard;
