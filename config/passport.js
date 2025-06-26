const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

const customFields = {
  usernameField: "email",
};

const verifyCallback = async (email, password, done) => {
  try {
    const user = await userModel.findByEmail(email);

    if (!user) {
      return done(null, false, { message: "Incorrect email." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return done(null, false, { message: "Incorrect password." });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
