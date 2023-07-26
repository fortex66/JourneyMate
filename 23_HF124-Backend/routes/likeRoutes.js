const express = require("express");
const { onLike, checkLikeStatus, getLikeCount } = require('../controllers/likeController');
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/', authMiddleware, onLike);
router.get('/status', authMiddleware, checkLikeStatus);
router.get('/likeCount', authMiddleware, getLikeCount);

module.exports = router;
