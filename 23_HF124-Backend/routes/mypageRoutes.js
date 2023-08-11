const express = require('express');
const {upload, profile}=require('../config');
const authMiddleware=require('../middleware/authMiddleware');
const mypageController =require('../controllers/mypageController');
const scrapController = require('../controllers/scrapController.js');
const router = express.Router();

// // 스크랩 라우터
router.get('/scrap',authMiddleware, scrapController.getScrapList);

// authMiddleware를 통과후 controller로 이동
router.get('/community', upload.array('photos[]', 10),authMiddleware, mypageController.getCommunityList);
router.get('/companion', upload.array('photos[]', 10),authMiddleware, mypageController.getCompanionList);

// 다른 유저 profile
router.get('/userprofile/profile/:userID',authMiddleware,mypageController.getProfile);
router.get('/userprofile/community/:userID',authMiddleware, mypageController.getUserCommunityList);
router.get('/userprofile/companion/:userID',authMiddleware, mypageController.getUserCompanionList);

// 7/28 라우팅 설정
router.get('/profile',authMiddleware,mypageController.getProfile);
router.put('/profileImage',authMiddleware,profile.array('photo',1),mypageController.setProfileImage);
router.put('/passwordChange',authMiddleware,mypageController.updatePassword);
router.put('/profileChange',authMiddleware, mypageController.updateUser);
router.delete('/logout',authMiddleware,mypageController.logout);

module.exports = router;
