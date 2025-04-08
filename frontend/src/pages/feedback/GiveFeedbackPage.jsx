import React, { useEffect, useState } from "react";
import FeedbackService from "../../services/FeedbackService";
import TeamService from "../../services/TeamService";
import Header from "../../components/common/Header"; // Import the global Header component
import '../../styles/givefeedback.css'; // Import the CSS for styling

const GiveFeedbackPage = () => {
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

  // Fetch all teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const ts = await TeamService.getAllTeams();
        setTeams(Array.isArray(ts) ? ts : []);
      } catch (err) {
        console.error("Error loading teams:", err);
        setError("Error loading teams. Please try again later.");
      }
    };
    fetchTeams();
  }, []);

  // Fetch team members when a team is selected
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!form.teamId) {
        setUsers([]);
        return;
      }
      try {
        const res = await TeamService.getTeamMembers(form.teamId);
        setUsers(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Error loading team members:", err);
        setUsers([]);
      }
    };
    fetchTeamMembers();
  }, [form.teamId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const res = await FeedbackService.giveFeedback(form);
      setMessage(res.message || "Feedback submitted successfully!");
      setForm({
        teamId: "",
        recipient_id: "",
        feedback_type: "positive",
        message: "",
        isAnonymous: false,
      });
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <>
      <Header /> {/* Global Header component */}
      <div className="give-feedback-page">
        <h2>Give Feedback</h2>

        {/* Success and Error Messages */}
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        {/* Feedback Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="teamId">Team:</label>
            <select
              id="teamId"
              name="teamId"
              value={form.teamId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Team --</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="recipient_id">Recipient:</label>
            <select
              id="recipient_id"
              name="recipient_id"
              value={form.recipient_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Select User from Team --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="feedback_type">Type:</label>
            <select
              id="feedback_type"
              name="feedback_type"
              value={form.feedback_type}
              onChange={handleChange}
            >
              <option value="positive">Positive</option>
              <option value="improvement">Improvement</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={form.isAnonymous}
                onChange={handleChange}
              />
              Submit Anonymously
            </label>
          </div>

          {/* Anonymous Indicator */}
          <p
            className="anonymous-indicator"
            style={{ color: form.isAnonymous ? "green" : "red" }}
          >
            {form.isAnonymous
              ? "Your feedback will be submitted anonymously."
              : "Your name will be visible to the recipient."}
          </p>

          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    </>
  );
};

export default GiveFeedbackPage;