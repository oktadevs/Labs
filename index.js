const express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  keys = require("./config/keys"),
  passport = require("passport"),
  OidcStrategy = require("passport-openidconnect").Strategy,
  session = require("express-session"),
  app = express();

require("./models/User");

mongoose.connect(
  keys.mongoURI,
  { useNewUrlParser: true }
);

require("./routes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("This server is ALIVE!!!!");
