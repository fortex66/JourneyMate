const User = require('../models/chatModel');
exports.getAllChats = (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'This route will get all chats'
    });
  };
