require("dotenv").config();
const userModel = require("../models/userModel");
const { validationResult } = require("express-validator");

const MEMBER_PASSCODE = process.env.MEMBER_PASSCODE;

const membershipController = {
  getMembership: (req, res) => {
    res.render("membership", {
      title: "Join the Club",
      user: req.user,
      errors: [],
    });
  },

  postMembership: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("membership", {
        title: "Join the Club",
        user: req.user,
        errors: errors.array(),
      });
    }

    const { code } = req.body;

    try {
      let newRoleId;
      let successMessage;

      if (code === MEMBER_PASSCODE) {
        newRoleId = 2; // 1 for new user, 2 for member
        successMessage = "Welcome to the club! You are now a member.";
      } else {
        return res.render("membership", {
          title: "Join the Club",
          user: req.user,
          errors: [{ msg: "Invalid code. Please try again." }],
        });
      }

      await userModel.updateUserRole(req.user.id, newRoleId);

      req.session.successMessage = successMessage; // use the current session to store a message
      res.redirect("/");
    } catch (error) {
      console.error("Error updating membership:", error);
      res.render("membership", {
        title: "Join the Club",
        user: req.user,
        errors: [{ msg: "Failed to update membership. Please try again." }],
      });
    }
  },
};

module.exports = membershipController;
