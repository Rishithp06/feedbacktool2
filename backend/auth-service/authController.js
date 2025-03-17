const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
    );
};

// Register Regular User
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, email, hashedPassword, "regular_user"]
        );

        res.status(201).json({ message: "Regular user registered successfully!", user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

// Register Admin
exports.registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, email, hashedPassword, "admin"]
        );

        res.status(201).json({ message: "Admin registered successfully!", user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error registering admin", error });
    }
};

// Register Super Admin
exports.registerSuperAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, email, hashedPassword, "super_admin"]
        );

        res.status(201).json({ message: "Super Admin registered successfully!", user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error registering Super Admin", error });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user.rows[0]);
        res.json({ message: "Login successful!", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

// Forgot Password (Send Email)
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (!user.rows.length) return res.status(400).json({ error: "User not found" });

        const resetToken = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "15m" });

        await pool.query(
            "INSERT INTO password_resets (user_id, reset_token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '15 minutes')",
            [user.rows[0].id, resetToken]
        );

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset",
            text: `Click the link to reset password: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Password reset email sent!" });

    } catch (error) {
        res.status(500).json({ message: "Error sending reset email", error });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { resetToken, newPassword } = req.body;

    try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hashedPassword, decoded.id]);
        await pool.query("DELETE FROM password_resets WHERE user_id = $1", [decoded.id]);

        res.json({ message: "Password reset successful!" });

    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error });
    }
};
