if (process.env.NODE_ENV != "production") {
  require('dotenv').config()
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
// const { AsyncLocalStorage } = require("async_hooks");

//middleware requires
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")


// routers 
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();
const port = process.env.PORT;
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const { error } = require('console');


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = process.env.MONGO_URL
main().then(() => {
  console.log("Connected to DB");
}).catch(err => {
  // console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}


const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  // connect-mongo encryption is optional; if enabled, the secret must be very complex.
  // Leave SESSION_CRYPTO_SECRET unset to keep sessions unencrypted in MongoDB.
  crypto: {
    secret: process.env.SESSION_CRYPTO_SECRET || false,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log(`ERROR in MONGO SESSION STORE ${err}`);
});

const sessionOption = {
  store: store,
  secret: "MybestSecretOptionKey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  },
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("./listings/index.ejs");
});

// all listing routes
app.use("/listings", listingRouter);

// all review routes
app.use("/listings/:id/reviews", reviewRouter);

// user routes
app.use("/", userRouter);



//page not found
app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});


//middleware
app.use((err, req, res, next) => {
  // If a handler already started sending the response, delegate to Express's
  // default error handler to avoid "Cannot set headers after they are sent".
  if (res.headersSent) return next(err);

  let { statusCode = 500, message = "Somethings Went Wrong!" } = err;
  res.status(statusCode).render("./listings/error.ejs", { message });
});

app.listen(port, (req, res) => {
  console.log(`App is running on ${port} Port`);
});

