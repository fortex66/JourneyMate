const express = require('express');
const chatController = require("../controllers/chatController");

const router = express.Router();

// Sample route


router.get("/", chatController.getAllChats); // getAllChats가 정의되어 있는지 확인
module.exports = router;
