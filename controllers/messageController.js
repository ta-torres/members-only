const messageModel = require("../models/messageModel");
const { validationResult } = require("express-validator");

const messageController = {
  getNewMessage: (req, res) => {
    res.render("newMessage", {
      title: "Create New Message",
      user: req.user,
      errors: [],
    });
  },

  postNewMessage: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("newMessage", {
        title: "Create New Message",
        user: req.user,
        errors: errors.array(),
        formData: req.body,
      });
    }

    try {
      await messageModel.create({
        title: req.body.title,
        content: req.body.content,
        userId: req.user.id,
      });

      res.redirect("/");
    } catch (error) {
      console.error("Error creating message:", error);
      res.render("newMessage", {
        title: "Create New Message",
        user: req.user,
        errors: [{ msg: "Failed to create message. Please try again." }],
        formData: req.body,
      });
    }
  },

  deleteMessage: async (req, res) => {
    try {
      const messageId = req.params.id;
      const deleted = await messageModel.deleteById(messageId);

      if (deleted) {
        res.redirect("/");
      } else {
        res.status(404).send("Message not found");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).send("Error deleting message");
    }
  },
};

module.exports = messageController;
