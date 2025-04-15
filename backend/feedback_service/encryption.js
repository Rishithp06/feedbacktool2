const crypto = require("crypto");
require("dotenv").config(); // Load environment variables from .env file

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // Must be 32 bytes (256 bits)
const IV_LENGTH = 16; // AES block size

// ✅ Encrypt a message
const encryptMessage = (message) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(message.trim(), "utf8", "hex"); // Trim message
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`.trim(); // Clean output
};

// ✅ Safely decrypt a message
const decryptMessage = (encryptedMessage) => {
    try {
        const trimmed = encryptedMessage.trim(); // 🧼 Clean leading/trailing whitespace
        const [iv, encrypted] = trimmed.split(":");

        // Validate IV and encrypted content
        if (!iv || !encrypted || iv.length !== 32) {
            throw new Error("Malformed encrypted message");
        }

        const decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            ENCRYPTION_KEY,
            Buffer.from(iv.trim(), "hex")
        );

        let decrypted = decipher.update(encrypted.trim(), "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    } catch (error) {
        console.warn("⚠️ Failed to decrypt message:", encryptedMessage, error.message);
        return "[Decryption Failed]";
    }
};

module.exports = { encryptMessage, decryptMessage };
