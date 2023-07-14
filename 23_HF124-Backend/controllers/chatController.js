const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { User, Message } = require('../models/chatModel');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('getUsers', async () => {
    try {
      const users = await User.findAll();
      socket.emit('users', users);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('sendMessage', async ({ senderId, receiverId, text }) => {
    try {
      const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        text,
        timestamp: new Date(),
      });
      socket.broadcast.emit('message', message);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
