const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const { config } = require("../configs/index");

const authResponse = async (token, tokenSecret, profile, done) => {
  const user = await User.findOne({
    where: { email: profile.emails[0].value },
  });
  if (!user) {
    const userCreated = await User.create({
      email: profile.emails[0].value,
      username: profile.displayName,
      token: token,
    }).catch((error) => done(error, null));
    done(null, userCreated);
  }
  done(null, user);
};

passport.use(
  new GoogleStrategy(
    {
      clientID: config.PASSPORT.GOOGLE_CONSUMER_KEY,
      clientSecret: config.PASSPORT.GOOGLE_CONSUMER_SECRET,
      callbackURL: `${config.HOSTNAME}:${config.PORT}/api/v1/auth/google/callback`,
    },
    authResponse
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

module.exports = passport;
