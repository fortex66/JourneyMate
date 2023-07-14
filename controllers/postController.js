const Post = require('../models/postModel');

exports.getAllPosts = (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'This route will get all posts'
    });
  };
  