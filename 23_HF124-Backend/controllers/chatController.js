const express = require('express'); //
const http = require('http');
const { Server } = require('socket.io');
const { User, Message } = require('../models/chatModel');
const app = express();
const server = http.createServer(app);
const io = new Server(server);


exports.getMessages = (req, res) => {
  const roomId = req.params.roomId;
  db.getMessages(roomId, (err, messages) => {
    if (err) res.status(500).json({ error: 'Error fetching messages' });
    else res.json(messages);
  });
};

exports.postMessage = (req, res) => {
  const roomId = req.params.roomId;
  const message = req.body;
  db.postMessage(roomId, message, (err) => {
    if (err) res.status(500).json({ error: 'Error posting message' });
    else res.status(200).json({ success: true });
  });
};

module.exports = exports;


