import React, { useState } from "react";
import TeamService from "../../services/TeamService";
import Header from "../../components/common/Header"; // ✅ Your global header

const ExcelTeamUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an Excel file to upload.");
      return;
    }

    try {
      const res = await TeamService.uploadExcel(file);
      if (res.message?.toLowerCase().includes("success")) {
        setMessage(res.message);
        setFile(null);
      } else {
        setError(res.message || "Something went wrong while uploading.");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload file.");
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: "2rem", minHeight: "90vh", background: "linear-gradient(to right, #4e54c8, #8f94fb)", color: "#fff" }}>
        <div style={{ maxWidth: "600px", margin: "auto", background: "#fff", padding: "2rem", borderRadius: "12px", color: "#333" }}>
          <h2>📤 Upload Excel to Create Teams & Members</h2>
          <p><strong>Excel Format Required:</strong> Columns must include <code>Team Name</code>, <code>Member Name</code>, and <code>Member Email</code>.</p>

          <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
          <br /><br />
          <button onClick={handleUpload} style={{ padding: "0.5rem 1rem", backgroundColor: "#4e54c8", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Upload Excel
          </button>

          {message && <p style={{ color: "green", marginTop: "1rem" }}>{message}</p>}
          {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        </div>
      </div>
    </>
  );
};

export default ExcelTeamUpload;
