const pool = require("../config/db");

// ✅ Get Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [req.user.id]);
        if (!user.rows.length) return res.status(404).json({ message: "User not found" });
        res.json(user.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};

// ✅ Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await pool.query("SELECT id, name, email, role FROM users");
        res.json(users.rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// ✅ Update User Info (including role if permitted)
exports.updateUser = async (req, res) => {
    const { name, email, role } = req.body;
    const isAdmin = req.user.role === "admin" || req.user.role === "super_admin";
    const targetUserId = isAdmin ? req.params.id : req.user.id;

    try {
        const existingUser = await pool.query("SELECT id FROM users WHERE id = $1", [targetUserId]);
        if (!existingUser.rows.length) return res.status(404).json({ message: "User not found" });

        // If role is included in the request and user is admin-level, update it too
        const query = isAdmin && role
            ? "UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, name, email, role"
            : "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role";

        const params = isAdmin && role
            ? [name, email, role, targetUserId]
            : [name, email, targetUserId];

        const updatedUser = await pool.query(query, params);

        res.json({ message: "User updated successfully", user: updatedUser.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

// ✅ Delete User
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
        if (!deletedUser.rows.length) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};
