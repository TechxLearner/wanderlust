const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const User = require("../models/user.js");
const userController = require("../controllers/user.js");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passportConfig = require("../config/passport.js");


// sign up route

router
    .route("/signup")
    .get(userController.signUpForm)
    .post(wrapAsync(userController.signUp));


//google auth routes
// routes/user.js

// 1. Trigger Google Login
router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

// 2. Google Callback
router.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login", failureFlash: true }),
    (req, res) => {
        req.flash("success", "Welcome Back! " + req.user.username.toUpperCase());
        // Explicitly save session before redirecting
        req.session.save((err) => {
            if (err) return next(err);
            return res.redirect("/listings");
        });
    }
);

// login route

router
    .route("/login")
    .get(userController.loginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: '/login',
            failureFlash: true
        }),
        userController.logIn
    );

// logout route
router.get("/logout", userController.logout);


module.exports = router;


