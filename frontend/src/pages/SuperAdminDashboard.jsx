import React, { useEffect, useState } from "react";
import FeedbackService from "../services/FeedbackService";
import '../styles/SuperAdminDashboard.css'; // Assuming you have some CSS for styling
const SuperAdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await FeedbackService.getAllFeedback();
        setFeedbacks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch feedback:", err);
        setError("Something went wrong while fetching feedback.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (loading) return <p>Loading feedback...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container" style={{ padding: "1rem" }}>
      <h2>📋 Super Admin Dashboard</h2>
      <p>All feedback submissions in the system:</p>

      {feedbacks.length === 0 ? (
        <p>No feedback found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0">
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
            {feedbacks.map((fb) => (
              <tr key={fb.id}>
                <td>{fb.id}</td>
                <td>{fb.sender_display}</td> {/* 👈 Use server-prepared sender_display */}
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
      )}
    </div>
  );
};

export default SuperAdminDashboard;
