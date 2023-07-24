const express = require("express");
const { onLike } = require('../controllers/likeController');
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/', authMiddleware, onLike);


module.exports = router;




