const pool = require("../config/db");

// ✅ Create an Email Group (Admins & Super Admins Only)
exports.createEmailGroup = async (req, res) => {
    const { groupName } = req.body;

    try {
        // Insert the new email group
        const newGroup = await pool.query(
            "INSERT INTO email_groups (name, created_by) VALUES ($1, $2) RETURNING id, name",
            [groupName, req.user.id]
        );

        res.status(201).json({ message: "Email group created successfully!", group: newGroup.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error creating email group", error: error.message });
    }
};

// ✅ Get All Email Groups (Admins & Super Admins Only)
exports.getAllEmailGroups = async (req, res) => {
    try {
        const groups = await pool.query("SELECT * FROM email_groups");
        res.json(groups.rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching email groups", error: error.message });
    }
};

// ✅ Add User to Email Group (Admins & Super Admins Only)
exports.addUserToEmailGroup = async (req, res) => {
    const { groupName, userId } = req.body;

    try {
        // Check if the email group exists
        const group = await pool.query("SELECT id FROM email_groups WHERE name = $1", [groupName]);
        if (group.rows.length === 0) {
            return res.status(400).json({ message: "Email group not found" });
        }

        await pool.query(
            "INSERT INTO email_group_members (group_id, user_id) VALUES ($1, $2)",
            [group.rows[0].id, userId]
        );

        res.json({ message: "User added to email group successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error adding user to email group", error: error.message });
    }
};

// ✅ Remove User from Email Group (Admins & Super Admins Only)
exports.removeUserFromEmailGroup = async (req, res) => {
    const { groupName, userId } = req.body;

    try {
        // Check if the email group exists
        const group = await pool.query("SELECT id FROM email_groups WHERE name = $1", [groupName]);
        if (group.rows.length === 0) {
            return res.status(400).json({ message: "Email group not found" });
        }

        await pool.query(
            "DELETE FROM email_group_members WHERE group_id = $1 AND user_id = $2",
            [group.rows[0].id, userId]
        );

        res.json({ message: "User removed from email group successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error removing user from email group", error: error.message });
    }
};
// ✅ Get Members of an Email Group (Admins & Super Admins Only)
exports.getEmailGroupMembers = async (req, res) => {
    const { groupName } = req.params;

    try {
        const group = await pool.query("SELECT id FROM email_groups WHERE name = $1", [groupName]);

        if (!group.rows.length) {
            return res.status(404).json({ message: "Email group not found" });
        }

        const groupId = group.rows[0].id;

        const members = await pool.query(
            `SELECT users.id, users.name, users.email
             FROM email_group_members
             INNER JOIN users ON users.id = email_group_members.user_id
             WHERE email_group_members.group_id = $1`,
            [groupId]
        );

        res.json(members.rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching email group members", error: error.message });
    }
};
exports.deleteEmailGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        await pool.query("DELETE FROM email_groups WHERE id = $1", [groupId]);
        res.json({ message: "Email group deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting group", error: error.message });
    }
};

