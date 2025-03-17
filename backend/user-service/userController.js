const pool = require("../config/db");


// ✅ Get Profile (Only Authenticated Users)
exports.getProfile = async (req, res) => {
    try {
        const user = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [req.user.id]);

        if (!user.rows.length) return res.status(404).json({ message: "User not found" });

        res.json(user.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
};

// ✅ Get All Users (Only Admins & Super Admins)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await pool.query("SELECT id, name, email, role FROM users");

        res.json(users.rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// ✅ Update User Info (Users can update themselves, Admins can update others)
exports.updateUser = async (req, res) => {
    const { name, email } = req.body;
    const userId = req.user.role === "admin" || req.user.role === "super_admin" ? req.params.id : req.user.id;

    try {
        const updatedUser = await pool.query(
            "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, role",
            [name, email, userId]
        );

        if (!updatedUser.rows.length) return res.status(404).json({ message: "User not found" });

        res.json({ message: "User updated successfully", user: updatedUser.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

// ✅ Delete User (Only Admins & Super Admins)
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
