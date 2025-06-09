// passport-azure-config.js
const passport = require("passport");
const { OIDCStrategy } = require("passport-azure-ad");
const pool = require("../config/db"); // Adjust path if needed
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new OIDCStrategy(
    {
      identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
      clientID: process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      responseType: "code",
      responseMode: "query",
      redirectUrl: process.env.AZURE_REDIRECT_URI,
      allowHttpForRedirectUrl: true,
      scope: ["profile", "email", "openid"],
    },
    async (iss, sub, profile, accessToken, refreshToken, done) => {
      try {
        const email = profile._json.preferred_username;
        const name = profile.displayName;

        // ✅ Always pull role from Azure token
        const azureRole = profile._json.roles?.[0] || "regular_user";

        const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        let user = userQuery.rows[0];

        if (!user) {
          // ✅ New user — insert with Azure role
          const insert = await pool.query(
            "INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *",
            [name, email, azureRole]
          );
          user = insert.rows[0];
        } else {
          // ✅ Existing user — always sync role from Azure
          const update = await pool.query(
            "UPDATE users SET role = $1 WHERE email = $2 RETURNING *",
            [azureRole, email]
          );
          user = update.rows[0];
        }

        return done(null, user);
      } catch (err) {
        console.error("Azure SSO strategy error:", err);
        return done(err, null);
      }
    }
  )
);

