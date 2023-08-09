const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const chatController = require("../controllers/chatController");
const router = express.Router();

router.get("/", authMiddleware, chatController.getChatRoom);
router.get("/:chatID", authMiddleware, chatController.enterChatRoom);
router.post("/:cpostID", authMiddleware, chatController.clickChatRoom);
router.delete("/chatroom/:chatID", authMiddleware, chatController.forcedExit);
router.delete("/chatroom", authMiddleware, chatController.getOut);
module.exports = router;
