// signupRoutes.js
const express = require('express');
const router = express.Router();

const signupController = require('../controllers/signupController');

router.post('/part1', signupController.processPart1); // 인적사항 받는 부분
router.post('/check-userID', signupController.checkUserID);// 아이디 중복검사
router.post('/email-verification', signupController.sendEmail); // 이메일 인증 로직
router.get('/search-address', signupController.searchAddress);
router.post('/part2', signupController.processPart2); // 지역설정 하는 부분
router.post('/part3', signupController.processPart3); // 태그설정 하는 부분

module.exports = router;
