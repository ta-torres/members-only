const express = require("express");
const membershipController = require("../controllers/membershipController");
const validationRules = require("../middleware/validation");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware.requireAuth, membershipController.getMembership);
router.post(
  "/",
  authMiddleware.requireAuth,
  validationRules.membershipCode,
  membershipController.postMembership
);

module.exports = router;
