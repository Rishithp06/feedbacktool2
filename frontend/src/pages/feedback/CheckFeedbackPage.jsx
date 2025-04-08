import React, { useEffect, useState } from "react";
import FeedbackService from "../../services/FeedbackService";
import '../../styles/receivefeedback.css';
const CheckFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const fb = await FeedbackService.getReceivedFeedback();
        setFeedbacks(Array.isArray(fb) ? fb : []);
      } catch (err) {
        console.error("Error loading feedbacks", err);
        setError("Error loading feedbacks. Check your connection.");
      }
    };
    fetchFeedbacks();
  }, []);

  const markAsRead = async (id) => {
    try {
      await FeedbackService.markAsRead(id);
      const updated = await FeedbackService.getReceivedFeedback();
      setFeedbacks(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error("Error marking feedback as read", err);
    }
  };

  return (
    <div className="container">
      <h2>Received Feedback</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

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

export default CheckFeedbackPage;