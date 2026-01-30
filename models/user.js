const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: [true, "Email already registered"],
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple users to have 'null' googleId (local users)
    },
    username: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;