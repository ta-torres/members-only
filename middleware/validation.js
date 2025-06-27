const { body } = require("express-validator");

const validationRules = {
  signup: [
    body("firstName")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("First name must be between 1 and 50 characters")
      .escape(),

    body("lastName")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Last name must be between 1 and 50 characters")
      .escape(),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],

  message: [
    body("title")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Title is required")
      .isLength({ max: 100 })
      .withMessage("Title must be less than 100 characters"),

    body("content")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Message content is required")
      .isLength({ max: 1000 })
      .withMessage("Message must be less than 1000 characters"),
  ],

  membershipCode: [
    body("code")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Membership code is required"),
  ],
};

module.exports = validationRules;
