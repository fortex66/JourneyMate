const express = require("express");
const { onLike, checkLikeStatus, getLikeCount } = require('../controllers/likeController');
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//좋아요 기능 처리 라우터
router.post('/', authMiddleware, onLike);
router.get('/status', authMiddleware, checkLikeStatus);
router.get('/likeCount', authMiddleware, getLikeCount);

module.exports = router;
