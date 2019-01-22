const express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  keys = require("./config/keys"),
  passport = require("passport"),
  OidcStrategy = require("passport-openidconnect").Strategy,
  session = require("express-session"),
  User = mongoose.model("users"),
  app = express();

require("./models/User");

module.exports = app => {
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(
    session(
      {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secret: keys.secretPhrase,
        resave: false,
        saveUninitialized: false
      },
      function(req, accessToken, refreshToken, profile, done) {}
    )
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    "oidc",
    new OidcStrategy(
      {
        issuer: keys.issuer,
        authorizationURL:
          "https://bigfootwebservice.okta.com/oauth2/default/v1/authorize",
        tokenURL: "https://bigfootwebservice.okta.com/oauth2/default/v1/token",
        userInfoURL:
          "https://bigfootwebservice.okta.com/oauth2/default/v1/userinfo",
        clientID: keys.clientID,
        clientSecret: keys.clientSECRET,
        callbackURL: keys.callbackURL,
        scope: "openid profile"
      },
      async (issuer, sub, profile, accessToken, refreshToken, done) => {
        const existingUser = await User.findOne({
          profileId: profile.id
        });
        if (existingUser) {
          done(null, existingUser);
        } else {
          const user = await new User({
            profileId: profile.id
          }).save();
          done(null, user);
        }
      }
    )
  );

  passport.serializeUser((user, next) => {
    next(null, user);
  });

  passport.deserializeUser((obj, next) => {
    next(null, obj);
  });

  app.get("/", function(req, res) {
    res.send("You've reached the root route!!!");
  });

  app.get("/login", function(req, res) {
    res.send("This is the login route");
  });

  app.get("/auth/oidc", function(req, res, next) {
    passport.authenticate("oidc", function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/");
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.send("Profile");
        // console.log(profile);
      });
    })(req, res, next);
  });

  app.get("/auth/oidc/callback", passport.authenticate("oidc"), (req, res) => {
    res.send("This is supposed to show the user logged in");
    console.log(req.user);
  });
};
