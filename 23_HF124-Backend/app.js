//app.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const signupRoutes = require('./routes/signupRoutes');
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');
dotenv.config();

const app = express();
const connectDB = require("./database/database"); //mysql DB 연결

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001', // or the correct origin for your client app
  credentials: true,
}));


connectDB();

app.use(session({
  secret: process.env.sessionKey,
  resave: false,
  saveUninitialized: false,
}));

app.use('/users', userRoutes);
app.use('/signup', signupRoutes);
app.use('/like', likeRoutes);
app.use('/chats', chatRoutes);
app.use('/community/post', commentRoutes);

const port = 3000
app.listen(port, () => {
  console.log("서버가 " + port,"번 포트에서 실행중입니다.");
});
