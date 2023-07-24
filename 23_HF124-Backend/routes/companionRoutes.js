const express = require('express');
const {upload}=require('../config');
const uploadController = require('../controllers/uploadController');
const commentController = require('../controllers/commentController');
const authMiddleware=require('../middleware/authMiddleware');

const router = express.Router();


// authMiddleware를 통과후 controller로 이동
router.post('/cupload', upload.array('files', 1),authMiddleware, uploadController.companionUploadpost);
router.delete('/:cpostID', authMiddleware, uploadController.companionDeletepost);
router.put('/:cpostID', upload.array('files', 1),authMiddleware, uploadController.companionUpdatePost);

// comment 부분
router.post('/comments/:cpostID',authMiddleware, commentController.companionAddComment);
router.delete('/comments/:cpostID',authMiddleware, commentController.companionDeleteComment);

module.exports = router;
