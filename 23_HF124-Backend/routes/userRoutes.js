const express = require("express");
const router = express.Router();
const { loginUser } = require('../controllers/userController'); //userController는 객체고 router.post는 두 번째 인자로 callback 함수를 받아야하기 때문에 이러한 형태로 작성

router.post("/login", loginUser);

module.exports = router;

