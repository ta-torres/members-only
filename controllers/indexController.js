const messageModel = require("../models/messageModel");

const indexController = {
  getHome: async (req, res) => {
    try {
      const messages = await messageModel.getAllMessages();
      res.render("index", {
        title: "Members Only Clubhouse",
        messages,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.render("index", {
        title: "Members Only Clubhouse",
        messages: [],
      });
    }
  },
};

module.exports = indexController;
