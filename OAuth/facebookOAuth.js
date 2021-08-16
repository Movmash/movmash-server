const shortid = require("shortid");
const passport = require("passport");
const User = require("../models/userModel");
const FacebookStrategy = require("passport-facebook").Strategy;
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: [
        "id",
        "displayName",
        "photos",
        "email",
        "profileUrl",
        "gender",
        "name",
      ],
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log(profile._json.picture);
      const userName = profile._json.name
        .split(" ")
        .join("_")
         + shortid.generate();
      User.findOne({ authId: profile.id }).then((existingUser) => {
        if (existingUser) {
          done(null, existingUser);
        } else {
          new User({
            authId: profile.id,
            userName: userName,
            fullName: profile._json.name,
            profileImageUrl: profile._json.picture.data.url + "?sz=100",
            provider: profile.provider,
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
