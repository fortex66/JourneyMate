const express = require("express");
const { onLike, checkLikeStatus } = require('../controllers/likeController');
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/', authMiddleware, onLike);
router.get('/status', authMiddleware, checkLikeStatus);

module.exports = router;
