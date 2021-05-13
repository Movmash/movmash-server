
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/userModel");

passport.serializeUser((user,done) => {
  done(null,user.id);
})
passport.deserializeUser((id,done) => {
  User.findById(id).then((user) => {
    done(null,user);
  });
})
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },(accessToken, refreshToken, profile, done) => {
      const userName = profile._json.email.split("@")[0];
    User.findOne({ email: profile._json.email }).then((existingUser) => {
      if (existingUser) {
        done(null, existingUser);
      } else {
        new User({
          googleId: profile.id,
          email: profile._json.email,
          userName: userName,
          fullName: profile._json.name,
          profileImageUrl: profile._json.picture,
        })
          .save()
          .then((user) => {
            done(null, user);
          });
      }
    });
    }
  )
);