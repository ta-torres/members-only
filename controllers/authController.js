const { validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const passport = require("passport");

const authController = {
  // GET /auth/signup
  getSignup: (req, res) => {
    res.render("auth/signup", {
      title: "Sign Up",
      errors: [],
      formData: {},
    });
  },

  // POST /auth/signup
  postSignup: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("auth/signup", {
        title: "Sign Up",
        errors: errors.array(),
        formData: req.body,
      });
    }

    try {
      // chck if user already exists before creating
      const { firstName, lastName, email, password } = req.body;

      const existingUser = await userModel.emailExists(email);
      if (existingUser) {
        return res.render("auth/signup", {
          title: "Sign Up",
          errors: [{ msg: "Email already exists" }],
          formData: req.body,
        });
      }

      await userModel.create({ firstName, lastName, email, password });

      res.redirect(
        "/auth/login?message=Registration successful! Please log in."
      );
    } catch (error) {
      console.error("Signup error:", error);
      res.render("auth/signup", {
        title: "Sign Up",
        errors: [{ msg: "An error occurred during registration" }],
        formData: req.body,
      });
    }
  },

  // GET /auth/login
  getLogin: (req, res) => {
    res.render("auth/login", {
      title: "Login",
      message: req.query.message || "",
      error: req.query.error || "",
    });
  },

  // POST /auth/login
  postLogin: (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.render("auth/login", {
          title: "Login",
          message: "",
          error: info.message,
        });
      }

      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/");
      });
    })(req, res, next);
  },

  // POST /auth/logout
  postLogout: (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect("/");
    });
  },
};

module.exports = authController;
