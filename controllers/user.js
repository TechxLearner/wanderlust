const User = require("../models/user.js");

module.exports.signUpForm = (req, res) => {
    res.render("users/singup.ejs");
};


// signup post route
module.exports.signUp = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "You're Registered Successfully | Welcome to wonderlust");
            return res.redirect("/listings");
        });
    } catch (e) {
        // console.log(e);
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
};


//login 
module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs");
};

//login post route

module.exports.logIn = async (req, res) => {
    req.flash("success", "Welcome to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectUrl);
};
// logout route
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You're logged out now!");
        return res.redirect("/listings");
    })
};