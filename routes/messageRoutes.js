const express = require("express");
const messageController = require("../controllers/messageController");
const validationRules = require("../middleware/validation");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/new", authMiddleware.requireAuth, messageController.getNewMessage);
router.post(
  "/new",
  authMiddleware.requireAuth,
  validationRules.message,
  messageController.postNewMessage
);

router.post(
  "/:id/delete",
  authMiddleware.requireAdmin,
  messageController.deleteMessage
);

module.exports = router;
