const express = require('express');
const {upload}=require('../config');
const authMiddleware=require('../middleware/authMiddleware');
const mypageController =require('../controllers/mypageController');
const scrapController = require('../controllers/scrapController.js');
const router = express.Router();

// // 스크랩 라우터
router.get('/:userID/scraps', scrapController.getScrapList);

// authMiddleware를 통과후 controller로 이동
router.get('/community', upload.array('photos[]', 10),authMiddleware, mypageController.getCommunityList);
router.get('/companion', upload.array('photos[]', 10),authMiddleware, mypageController.getCompanionList);

module.exports = router;