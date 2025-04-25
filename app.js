if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const mongoose = require("mongoose");
const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then((res) => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // in seconds
});

store.on("error", ()=> {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store:store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires: Date.now() + (7*24*60*60*1000), // 1 week
    maxAge: 7*24*60*60*1000,
    httpOnly: true,   // option used for cross scripting attacks
  }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( (req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req,res) => {
  req.redirect("/listings");
})


app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/", userRouter);

app.get("/", (req,res) => {
  res.redirect("/listings");
})
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode=500, message="something went wrong" } = err;
  res.status(statusCode).render("error.ejs",{err});
});

const port = 8080;
app.listen(8080, () => {
  console.log("listening to port", port);
});
