const pool = require("../config/db");
const multer = require("multer");
const xlsx = require("xlsx");
const { v4: uuidv4 } = require("uuid");

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

const uploadTeamExcel = [
  upload, // multer middleware
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }

      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json(sheet);

      const createdTeams = new Set();

      for (const row of rows) {
        const teamName = row["Team Name"];
        const memberName = row["Member Name"];
        const memberEmail = row["Member Email"];

        if (!teamName || !memberName || !memberEmail) continue;

        // ✅ 1. Ensure user exists
        let userResult = await pool.query("SELECT * FROM users WHERE email = $1", [memberEmail]);
        let user;

        if (userResult.rows.length === 0) {
          const inserted = await pool.query(
            "INSERT INTO users (id, name, email, role, password_hash) VALUES ($1, $2, $3, 'regular_user', '') RETURNING *",
            [uuidv4(), memberName, memberEmail]
          );
          user = inserted.rows[0];
        } else {
          user = userResult.rows[0];
        }

        // ✅ 2. Create team if not already done in this run
        let team;
        if (!createdTeams.has(teamName)) {
          const existingTeam = await pool.query("SELECT * FROM teams WHERE name = $1", [teamName]);

          if (existingTeam.rows.length === 0) {
            const inserted = await pool.query(
              "INSERT INTO teams (id, name, created_by) VALUES ($1, $2, $3) RETURNING *",
              [uuidv4(), teamName, req.user.id]
            );
            team = inserted.rows[0];
          } else {
            team = existingTeam.rows[0];
          }

          createdTeams.add(teamName);
        } else {
          const fetchedTeam = await pool.query("SELECT * FROM teams WHERE name = $1", [teamName]);
          team = fetchedTeam.rows[0];
        }

        const teamId = team.id;

        // ✅ 3. Add user to team if not already present
        const exists = await pool.query(
          "SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2",
          [teamId, user.id]
        );

        if (exists.rows.length === 0) {
          await pool.query(
            "INSERT INTO team_members (id, team_id, user_id) VALUES ($1, $2, $3)",
            [uuidv4(), teamId, user.id]
          );
        }
      }

      res.json({ message: "Excel upload processed successfully." });
    } catch (err) {
      console.error("❌ Excel Upload Error:", err);
      res.status(500).json({ message: "Failed to process Excel", error: err.message });
    }
  },
];

module.exports.uploadTeamExcel = uploadTeamExcel;

// ✅ Create a Team with Manual User Entry (Admins Only)
exports.createTeam = async (req, res) => {
    const { teamName, userEmails } = req.body; // userEmails is a comma-separated string of emails

    try {
        // ✅ Insert the new team
        const newTeam = await pool.query(
            "INSERT INTO teams (name, created_by) VALUES ($1, $2) RETURNING id, name",
            [teamName, req.user.id]
        );

        const teamId = newTeam.rows[0].id;

        // ✅ Convert emails to an array
        const emailsArray = userEmails.split(",").map(email => email.trim());

        // ✅ Fetch user IDs from the database
        const users = await pool.query(
            "SELECT id, email FROM users WHERE email = ANY($1)",
            [emailsArray]
        );

        if (users.rows.length !== emailsArray.length) {
            return res.status(400).json({ message: "Some emails do not exist in the system!" });
        }

        // ✅ Add users to the team
        for (let user of users.rows) {
            await pool.query("INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)", [teamId, user.id]);
        }

        res.status(201).json({ message: "Team created successfully with selected users!", team: newTeam.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error creating team", error: error.message });
    }
};

// ✅ Get All Teams (Any Authenticated User)
exports.getAllTeams = async (req, res) => {
    try {
      const teams = await pool.query(
        "SELECT * FROM teams WHERE created_by = $1",
        [req.user.id]
      );
      res.json(teams.rows);
    } catch (error) {
      res.status(500).json({ message: "Error fetching teams", error: error.message });
    }
  };
  

// ✅ Get Team Members (Any Authenticated User)
exports.getTeamMembers = async (req, res) => {
    const { teamId } = req.params;
  
    try {
      // Check ownership
      const team = await pool.query("SELECT * FROM teams WHERE id = $1 AND created_by = $2", [
        teamId,
        req.user.id,
      ]);
      if (team.rows.length === 0) {
        return res.status(403).json({ message: "You are not authorized to view this team" });
      }
  
      const members = await pool.query(
        "SELECT users.id, users.name, users.email FROM team_members INNER JOIN users ON team_members.user_id = users.id WHERE team_members.team_id = $1",
        [teamId]
      );
  
      res.json(members.rows);
    } catch (error) {
      res.status(500).json({ message: "Error fetching team members", error: error.message });
    }
  };
  
// ✅ Add User to Team (Admins & Super Admins Only)
exports.addUserToTeam = async (req, res) => {
    const { teamId, userEmail } = req.body;
  
    try {
      const team = await pool.query("SELECT * FROM teams WHERE id = $1 AND created_by = $2", [
        teamId,
        req.user.id,
      ]);
      if (team.rows.length === 0) {
        return res.status(403).json({ message: "You are not authorized to modify this team" });
      }
  
      const user = await pool.query("SELECT id FROM users WHERE email = $1", [userEmail]);
      if (user.rows.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const existing = await pool.query(
        "SELECT id FROM team_members WHERE team_id = $1 AND user_id = $2",
        [teamId, user.rows[0].id]
      );
      if (existing.rows.length > 0) {
        return res.status(400).json({ message: "User is already in the team" });
      }
  
      await pool.query("INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)", [
        teamId,
        user.rows[0].id,
      ]);
  
      res.json({ message: "User added to team successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error adding user", error: error.message });
    }
  };
  

// ✅ Remove User from Team (Admins & Super Admins Only)
exports.removeUserFromTeam = async (req, res) => {
    const { teamId, userEmail } = req.body;
  
    try {
      const team = await pool.query("SELECT * FROM teams WHERE id = $1 AND created_by = $2", [
        teamId,
        req.user.id,
      ]);
      if (team.rows.length === 0) {
        return res.status(403).json({ message: "You are not authorized to modify this team" });
      }
  
      const user = await pool.query("SELECT id FROM users WHERE email = $1", [userEmail]);
      if (user.rows.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }
  
      await pool.query("DELETE FROM team_members WHERE team_id = $1 AND user_id = $2", [
        teamId,
        user.rows[0].id,
      ]);
  
      res.json({ message: "User removed from team successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error removing user", error: error.message });
    }
  };
  

// ✅ Delete Team (Admins & Super Admins Only)
exports.deleteTeam = async (req, res) => {
    const { teamId } = req.params;
  
    try {
      const team = await pool.query("SELECT * FROM teams WHERE id = $1 AND created_by = $2", [
        teamId,
        req.user.id,
      ]);
      if (team.rows.length === 0) {
        return res.status(403).json({ message: "You are not authorized to delete this team" });
      }
  
      await pool.query("DELETE FROM team_members WHERE team_id = $1", [teamId]);
      await pool.query("DELETE FROM teams WHERE id = $1", [teamId]);
  
      res.json({ message: "Team deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting team", error: error.message });
    }
  };
  
