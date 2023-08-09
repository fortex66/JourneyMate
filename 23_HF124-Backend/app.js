require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookiParser = require("cookie-parser");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const signupRoutes = require("./routes/signupRoutes");
const likeRoutes = require("./routes/likeRoutes");
const communityRoutes = require("./routes/communityRoutes");
const companionRoutes = require("./routes/companionRoutes");
const mypageRoutes = require("./routes/mypageRoutes");
// const chatRoutes = require('./routes/chatRoutes');
const socketio = require("socket.io");
const { GroupChat, Message } = require("./models/chatModel");
const http = require("http");

//HTTPS 연결 테스트용
// const https = require('https');
const fs = require("fs");

dotenv.config();

const app = express();

//HTTPS 연결 테스트용
// const options = {
//   key: fs.readFileSync('./rootCA-key.pem'),
//   cert: fs.readFileSync('./rootCA.pem'),
// };
// const server = https.createServer(options, app);

const server = http.createServer(app);

const connectDB = require("./database/database");
connectDB();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookiParser());
app.use("/uploads", express.static("uploads"));

app.use(
  session({
    secret: process.env.sessionKey,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/community", communityRoutes);
app.use("/companion", companionRoutes);
app.use("/users", userRoutes);
app.use("/signup", signupRoutes);
app.use("/like", likeRoutes);
app.use("/mypage", mypageRoutes);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("서버가 " + port + "번 포트에서 실행중입니다.");
});

const io = socketio(server, {
  cors: {
    origin: "*",
    // methods: ["GET", "POST"], // 초기 연결할때 handshake용
    credentials: true,
  },
});

// 이제 'chatRoutes'를 require합니다.
const chatRoutes = require("./routes/chatRoutes");
// app.use('/chat',chatRoutes);
app.use("/chat", chatRoutes);
module.exports = { io };
