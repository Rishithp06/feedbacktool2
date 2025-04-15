// scripts/encryptOldFeedback.js
const pool = require("./db"); // Adjust path to your DB config if needed
const { encryptMessage } = require("./encryption");

(async () => {
    try {
        console.log("🔍 Checking for unencrypted feedback messages...");

        // Find feedback messages without encryption (no colon in message)
        const res = await pool.query(
            "SELECT id, message FROM feedback WHERE message NOT LIKE '%:%'"
        );

        if (res.rows.length === 0) {
            console.log("✅ All messages are already encrypted.");
            process.exit(0);
        }

        console.log(`⚠️ Found ${res.rows.length} unencrypted messages. Encrypting...`);

        // Encrypt each one and update in DB
        for (const row of res.rows) {
            const original = row.message.trim(); // Trim just in case
            const encrypted = encryptMessage(original);

            // Skip malformed encryption (extra safety)
            if (!encrypted.includes(":")) {
                console.warn(`❌ Skipping message ID ${row.id} — encryption failed.`);
                continue;
            }

            await pool.query(
                "UPDATE feedback SET message = $1 WHERE id = $2",
                [encrypted, row.id]
            );

            console.log(`🔐 Encrypted message ID ${row.id}`);
        }

        console.log("✅ All unencrypted messages have been secured.");
    } catch (error) {
        console.error("❌ Error during encryption:", error.message);
    } finally {
        process.exit(0);
    }
})();
