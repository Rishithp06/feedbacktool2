import React, { useEffect, useState } from "react";
import FeedbackService from "../../services/FeedbackService";
import Header from "../../components/common/Header"; // Import the Header component
import "../../styles/receivefeedback.css";

const CheckFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const fb = await FeedbackService.getReceivedFeedback();
        setFeedbacks(Array.isArray(fb) ? fb : []);
      } catch (err) {
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
      setSelected(updated.find(f => f.id === id));
    } catch (err) {
      console.error("Error marking feedback as read", err);
    }
  };

  return (
    <>
      <Header /> {/* Add the Header component */}
      <div className="feedback-page split-view">
        {error && <p className="error-message">{error}</p>}

        <div className="left-panel">
          <h3>📥 Feedback</h3>
          {feedbacks.length === 0 ? (
            <p className="no-feedback">No feedback yet.</p>
          ) : (
            feedbacks.map((fb) => (
              <div
                key={fb.id}
                className={`feedback-item ${selected?.id === fb.id ? "active" : ""}`}
                onClick={() => setSelected(fb)}
              >
                <div className="feedback-type">{fb.feedback_type.toUpperCase()}</div>
                <div className="feedback-preview">
                  {fb.message.slice(0, 40)}...
                </div>
                <div className="feedback-status">
                  {fb.is_read ? "✅" : "❌"}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="right-panel">
          {selected ? (
            <div className="feedback-detail">
              <h3>{selected.feedback_type.toUpperCase()}</h3>
              <p className="feedback-message">{selected.message}</p>
              <p><strong>Anonymous:</strong> {selected.is_anonymous ? "Yes" : "No"}</p>
              {!selected.is_anonymous && selected.sender_name && (
                <p><strong>From:</strong> {selected.sender_name} ({selected.sender_email})</p>
              )}
              <p><strong>Status:</strong> {selected.is_read ? "✅ Read" : "❌ Unread"}</p>
              {!selected.is_read && (
                <button className="read-button" onClick={() => markAsRead(selected.id)}>
                  Mark as Read
                </button>
              )}
            </div>
          ) : (
            <p className="select-instruction">Select a feedback to view details →</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckFeedbackPage;