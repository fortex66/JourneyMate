//app.js
require('dotenv').config();
const express = require('express'); // 서버용 라이브러리
const cors = require('cors'); // CORS
const session = require('express-session'); // 세션유지용 라이브러리
const cookiParser = require('cookie-parser');
const dotenv = require('dotenv');// 비밀번호 환경변수 처리 라이브러리
const userRoutes = require('./routes/userRoutes'); // 이동
//const chatRoutes = require('./routes/chatRoutes');
const signupRoutes = require('./routes/signupRoutes');
const likeRoutes = require('./routes/likeRoutes');
const communityRoutes = require('./routes/communityRoutes');
const companionRoutes = require('./routes/companionRoutes');


dotenv.config();

const app = express();
const connectDB = require("./database/database"); //mysql DB 연결
connectDB();

app.use(cors({
  origin: true, // or the correct origin for your client app
  credentials: true,
}));

app.use(express.json());
app.use(cookiParser());





app.use(session({
  secret: process.env.sessionKey,
  resave: false,
  saveUninitialized: false,
}));

app.use('/community', communityRoutes);
app.use('/companion', companionRoutes);
app.use('/users', userRoutes); //POST, PUT, GET, DELETE
app.use('/signup', signupRoutes);
app.use('/like', likeRoutes);
//app.use('/chats', chatRoutes);

const port = 3000
app.listen(port, () => {
  
  console.log("서버가 " + port,"번 포트에서 실행중입니다.");
});
