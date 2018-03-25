const express = require("express");
const path = require('path');
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require('passport');


const users = require('./routes/users');
const ideas = require('./routes/ideas');

require('./config/passport')(passport);
//db config
const db = require('./config/database')

const app = express();

//map global promise to get rid of deprecation warning
mongoose.Promise = global.Promise;
//connect to mongoose -- whatever name you put after the / will be the name of you database
mongoose
  .connect(db.mongoURI)
  .then(() => console.log("Mongodb connected"))
  .catch(err => console.log(err));



//handlebars middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);

app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//method overrive middleware
app.use(methodOverride("_method"));
//Express session middleware
app.use(
  session({
    secret: "forrest",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname,'public')))

app.use(flash());

//Global variables

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null
  next();
});

const PORT = process.env.PORT || 5000;


app.use('/ideas', ideas)


app.use('/users', users)

app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", { title: title });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
