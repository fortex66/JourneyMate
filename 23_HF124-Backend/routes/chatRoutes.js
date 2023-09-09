const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const chatController = require("../controllers/chatController");
const {getIo}=require("../socket");
const {chatting}=require("../config");
const router = express.Router();

router.get("/download",authMiddleware,chatController.downloadImage);

router.delete("/chatroomquit/:chatID", authMiddleware, chatController.getOut);
router.get("/", authMiddleware, chatController.getChatRoom);
router.get("/:chatID", authMiddleware, chatController.chatMessage);
router.get("/chatroomdata/:chatID",authMiddleware,chatController.enterChatRoom);
router.post("/:cpostID", authMiddleware, chatController.clickChatRoom);
router.post("/chattingRoom/file/:chatID", authMiddleware, chatting.single("files"), (req, res) => {
  const io = getIo();  // 이렇게 io 객체를 가져옵니다.
  chatController.uploadFile(io)(req, res);
});
router.post("/chattingRoom/video/:chatID", authMiddleware, chatting.single("video"), (req, res) => {
  const io = getIo();  // 이렇게 io 객체를 가져옵니다.
  chatController.uploadVideo(io)(req, res);
});
router.post("/chattingRoom/:chatID", authMiddleware, chatting.single("image"), (req, res) => {
  const io = getIo();  // 이렇게 io 객체를 가져옵니다.
  chatController.uploadImage(io)(req, res);
});

router.delete("/chatroom/:chatID", authMiddleware, chatController.forcedExit);

module.exports = router;
