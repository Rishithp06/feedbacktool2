const nodemailer = require("nodemailer");
const pool = require("./db");
const moment = require("moment-timezone");
const { decryptMessage } = require("./encryption"); // Import decryption function
require("dotenv").config();

// ✅ Configure Email Transporter (Gmail SMTP)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use Google App Password if 2FA is enabled
    },
});

// ✅ Function to Send Feedback Email
const sendFeedbackEmail = async (feedback) => {
    try {
        // ✅ Get Recipient's Email & Team Name
        const recipientQuery = await pool.query(
            "SELECT users.email, teams.name AS team_name FROM users, teams WHERE users.id = $1 AND teams.id = $2",
            [feedback.recipient_id, feedback.team_id]
        );

        if (recipientQuery.rows.length === 0) {
            console.error(`❌ No recipient or team found for feedback ID: ${feedback.id}`);
            return;
        }

        const { email: recipientEmail, team_name } = recipientQuery.rows[0];

        // ✅ Decrypt Feedback Message (Fallback, if not already decrypted)
        if (!feedback.message.includes(":")) {
            feedback.message = decryptMessage(feedback.message);
        }

        // ✅ Convert Scheduled Time to IST
        const scheduledTimeIST = moment(feedback.scheduled_at).tz("Asia/Kolkata").format("LLLL"); // Example: Monday, March 25, 2024 10:00 AM IST
        const createdTimeIST = moment(feedback.created_at).tz("Asia/Kolkata").format("LLLL");

        // ✅ Construct Email Content
        let subject = feedback.feedback_type === "positive" ? " Positive Feedback Received!" : " Improvement Feedback for You!";
        let senderInfo = feedback.is_anonymous ? "Anonymous" : "A Team Member";

        let body = `
            <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                <h2 style="color: #4CAF50;">${subject}</h2>
                <p style="font-size: 16px;">${feedback.message}</p>
                <hr>
                <p><strong> Sender:</strong> ${senderInfo}</p>
                <p><strong> Team:</strong> ${team_name}</p>
                <p> <strong>Created At (IST):</strong> ${createdTimeIST}</p>
                <p> <strong>Scheduled Delivery (IST):</strong> ${scheduledTimeIST}</p>
                <hr>
                <p style="color: #777;">You can view more feedback in your dashboard.</p>
            </div>
        `;

        // ✅ Send Email
        await transporter.sendMail({
            from: `"Feedback System" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            subject: subject,
            html: body,
        });

        console.log(`✅ Feedback email sent to ${recipientEmail} at ${moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")} (IST)`);
    } catch (error) {
        console.error(`❌ Error sending feedback email for feedback ID: ${feedback.id}`, error.message);
    }
};

module.exports = { sendFeedbackEmail };