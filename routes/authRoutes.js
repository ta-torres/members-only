const express = require("express");
const authController = require("../controllers/authController");
const validationRules = require("../middleware/validation");

const router = express.Router();

router.get("/signup", authController.getSignup);
router.post("/signup", validationRules.signup, authController.postSignup);

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

module.exports = router;
