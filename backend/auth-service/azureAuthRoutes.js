const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// 🚪 Step 1: Start Azure SSO login
router.get(
  "/azure",
  passport.authenticate("azuread-openidconnect", {
    failureRedirect: "/unauthorized",
  })
);

// 🎯 Step 2: Callback from Azure (must be GET)
router.get(
  "/azure/redirect",
  passport.authenticate("azuread-openidconnect", {
    failureRedirect: "/unauthorized",
  }),
  (req, res) => {
    const user = req.user;

    // Create JWT for frontend
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/redirect?token=${token}`);
    console.log("Redirecting to:", `${process.env.FRONTEND_URL}/auth/redirect?token=${token}`);

  }
);

module.exports = router;
