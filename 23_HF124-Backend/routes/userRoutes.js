const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/userController"); //userController는 객체고 router.post는 두 번째 인자로 callback 함수를 받아야하기 때문에 이러한 형태로 작성
const { upload, profile } = require("../config");
const authMiddleware = require("../middleware/authMiddleware");
const mypageController = require("../controllers/mypageController");
const scrapController = require("../controllers/scrapController.js");

router.post("/login", loginUser);
router.get("/profile/:userId", authMiddleware, mypageController.getUserProfile);
router.get(
  "/community/:userId",
  authMiddleware,
  mypageController.getUserCommunityList
);
router.get(
  "/companion/:userId",
  authMiddleware,
  mypageController.getUserCompanionList
);
module.exports = router;
