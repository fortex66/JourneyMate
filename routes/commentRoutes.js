const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/:tpostID', commentController.addComment);
router.delete('/:tpostID', commentController.deleteComment);

module.exports = router;
