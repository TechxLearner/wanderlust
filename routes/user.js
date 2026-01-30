const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

// sign up route

router
    .route("/signup")
    .get(userController.signUpForm)
    .post(wrapAsync(userController.signUp));

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


