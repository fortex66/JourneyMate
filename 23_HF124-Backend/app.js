require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookiParser = require('cookie-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const signupRoutes = require('./routes/signupRoutes');
const likeRoutes = require('./routes/likeRoutes');
const communityRoutes = require('./routes/communityRoutes');
const companionRoutes = require('./routes/companionRoutes');
const User = require('./models/userModel');
const http = require('http');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const { GroupChat, Message } = require('./models/chatModel');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const connectDB = require("./database/database");
const { upload } = require('./config');
connectDB();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(cookiParser());
app.use('/uploads', express.static('uploads'))

app.use(session({
  secret: process.env.sessionKey,
  resave: false,
  saveUninitialized: false,
}));

app.use('/community', communityRoutes);
app.use('/companion', companionRoutes);
app.use('/users', userRoutes);
app.use('/signup', signupRoutes);
app.use('/like', likeRoutes);

let rooms = [];

// Middleware to authenticate user from JWT token in socket handshakeeeee
io.use(async (socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, process.env.jwtSecretkey, async (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      let user = await User.findOne({ where: { userID: decoded.userID } });
      if (!user) {
        return next(new Error('Authentication err
      }
      socket.user = user;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('새로운 유저가 접속했습니다.')
  let user = socket.user;

  socket.on('createRoom', async (room) => {
    const newGroupChat = await GroupChat.create({
      chatID: room.chatID,
      chattime: new Date(),
      lastchat: room.lastchat,
      admin: user.userID,
      cpostID: room.cpostID,
      userID: user.userID,
    });

    rooms.unshift(newGroupChat);
    io.emit('roomList', rooms);
  });

  socket.on('getRooms', () => {
    io.emit('roomList', rooms);
  });

  socket.on('join', ({ room }, callback) => {
    if (!room) {
      return callback({error : '방을 선택해주세요.'});
    }
    socket.join(room);
    socket.emit('message', {
      user: 'admin',
      text: `${user.userID}, ${room}에 오신 것을 환영합니다.`,
    });

    socket.broadcast.to(room).emit('message', {
      user: 'admin',
      text: `${user.userID}님이 참가하셨습니다.`,
    });

    io.to(room).emit('roomData', {
      room: room,
      users: user.userID
    });

    callback();
  });

  socket.on('sendMessage', async (message, callback) => {
    const room = Object.keys(socket.rooms)[0];
    const newMessage = await Message.create({
      mid: message.mid,
      content: message.content,
      read: false,
      sendtime: new Date(),
      chatID: room,
      userID: user.userID,
    });

    io.to(room).emit('message', {
      user: user.userID,
      text: newMessage.content,
    });
    callback();
  });

  socket.on('disconnect', () => {
    console.log('유저가 나갔습니다.');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("서버가 " + port + "번 포트에서 실행중입니다.");
});
