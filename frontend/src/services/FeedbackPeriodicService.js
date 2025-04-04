const API_BASE = process.env.REACT_APP_FEEDBACK_SERVICE_URL || "http://localhost:5003/feedback-periodic";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const FeedbackPeriodicService = {
  // ✅ Create a new periodic feedback schedule
  createSchedule: async (data) => {
    try {
      const response = await fetch(`${API_BASE}/schedule-periodic`, {
        method: "POST",
        ...getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) throw new Error(`Server error ${response.status}`);
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        throw new Error("Invalid JSON response from server");
      }
    } catch (err) {
      console.error("createSchedule error:", err);
      return { message: err.message || "Unknown error" };
    }
  },

  // ✅ Get all periodic feedback schedules
  getAllSchedules: async () => {
    try {
      const response = await fetch(`${API_BASE}/scheduled-periodic`, getAuthHeaders());
      return await response.json();
    } catch (err) {
      console.error("getAllSchedules error:", err);
      return [];
    }
  },
};

export default FeedbackPeriodicService;
