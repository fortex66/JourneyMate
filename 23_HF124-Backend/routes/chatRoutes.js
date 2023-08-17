const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const chatController = require("../controllers/chatController");
const router = express.Router();

router.delete("/chatroomquit/:chatID", authMiddleware, chatController.getOut);
router.get("/", authMiddleware, chatController.getChatRoom);
router.get("/:chatID", authMiddleware, chatController.chatMessage);
router.get(
  "/chatroomdata/:chatID",
  authMiddleware,
  chatController.enterChatRoom
);
router.post("/:cpostID", authMiddleware, chatController.clickChatRoom);
router.delete("/chatroom/:chatID", authMiddleware, chatController.forcedExit);

module.exports = router;
