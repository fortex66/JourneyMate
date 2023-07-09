const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

// Sample route
router.get('/', postController.getAllPosts);

module.exports = router;
