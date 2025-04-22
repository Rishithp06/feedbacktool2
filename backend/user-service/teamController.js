const pool = require("../config/db");

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
  
