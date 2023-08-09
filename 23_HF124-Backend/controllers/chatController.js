const users = require("../models/userModel");
const chat = require("../models/chatModel");
const post = require("../models/uploadModel");
const { Op, Sequelize, QueryTypes } = require("sequelize");
const { sequelize } = require("../config");

// 이벤트 핸들러 등록 부분
// 원래 'io.on'이 시작되는 부분을 다음과 같이 변경합니다.
// function registerSocketHandlers() {
//   const {io} = require('../app');

//   io.on('connection', (socket) => {
//     console.log('a user connected');
//     // 사용자가 연결을 끊었을 때
//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });

//     // 사용자가 메시지를 보냈을 때
//     socket.on('chat message', (msg) => {
//       console.log('message: ' + msg);
//       // 메시지를 모든 클라이언트에게 보냅니다.
//       io.emit('chat message', msg);
//     });
//   });
// }

// registerSocketHandlers();

//채팅방 리스트 불러오기
const getChatRoom = async (req, res) => {
  try {
    const getlist = await chat.user_chat.findAll({
      attributes: ["chatID"],
      where: { userID: req.decode.userID },
      include: [
        {
          model: chat.GroupChat,
          attributes: ["cpostID"],
          required: true,
          include: [
            {
              model: post.cPost,
              required: true,
              attributes: [
                "title",
                "startDate",
                "finishDate",
                "personnel",
                "location",
              ],
              as: "companion_posts",
            },
          ],
        },
      ],
      order: [[chat.GroupChat, "chattime", "DESC"]],
    });

    console.log(getlist);
    res.status(200).json(getlist);
  } catch (err) {
    console.error(err);
  }
};
//채팅방 입장 api
const enterChatRoom = async (req, res) => {
  const chatID = req.params.chatID;
  const { page = 1, per_page = 30 } = req.query;
  const chatMessage = await chat.Message.findAndCountAll({
    offset: per_page * (page - 1),
    limit: per_page,
    order: [["sendtime", "DESC"]],
    where: { chatID: chatID },
    include: [{ model: chat.GroupChat, as: "group_chattings" }],
  })
    .then(
      res
        .status(200)
        .json({
          chatMessage,
          result: true,
          message: "채팅방에 입장하였습니다.",
        })
    )
    .catch((err) => {
      console.error(err);
      res
        .status(404)
        .json({ result: false, message: "채팅방 입장에 실패하였습니다." });
    });
};
//채팅방에 입장하기
const clickChatRoom = async (req, res) => {
  const cpostID = req.params.cpostID;

  try {
    const chatRoom = await chat.GroupChat.findOne({
      attributes: ["chatID"],
      where: { cpostID: cpostID },
    });
    console.log(chatRoom.chatID);
    const chatID = chatRoom.chatID;

    const enter = await chat.user_chat
      .create({
        userID: req.decode.userID,
        chatID: chatRoom.chatID,
      })
      .then(res.status(200).json({ chatID, message: "채팅방 입장 성공" }))
      .catch(res.status(500).json({ message: "채팅방 입장 실패" }));
    console.log(enter);
  } catch (err) {
    console.error(err);
  }
};
//강제퇴장 api
const forcedExit = async (req, res) => {
  try {
    const roomAdmin = await chat.GroupChat.findOne({
      attributes: ["admin"],
      where: { chatID: req.body.chatID },
    });

    if (roomAdmin.admin != req.decode.userID) {
      res
        .status(500)
        .json({ result: false, message: "권한이 없는 접근 입니다." });
    } else {
      await chat.user_chat.destroy({
        where: { userID: req.body.userID },
      }),
        then(
          res
            .status(200)
            .json({
              result: true,
              message: "퇴장이 성공적으로 이루어졌습니다.",
            })
        ).catch((error) => {
          console.error(error);
          res
            .status(404)
            .json({ result: false, message: "퇴장 조치에 문제가 생겼습니다." });
        });
    }
  } catch (err) {
    console.error(err);
  }
};
//채팅방 퇴장 기능
const getOut = async (req, res) => {
  try {
    await chat.user_chat
      .destroy({
        where: { userID: req.decode.userID, chatID: req.body.chatID },
      })
      .then(
        res
          .status(200)
          .json({ result: true, message: "채팅방에서 퇴장하였습니다" })
      )
      .catch((err) => {
        console.error(err);
        res
          .status(404)
          .json({ result: false, message: "채팅방 퇴장에 실패하였습니다." });
      });
  } catch (err) {
    res
      .status(500)
      .json({ result: false, message: "서버에 문제가 생겼습니다." });
  }
};
// io.on('connection', (socket) => {
//   console.log('a user connected');
//   // 사용자가 연결을 끊었을 때
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });

//   socket.on()

//   // 사용자가 메시지를 보냈을 때
//   socket.on('chat message', (msg) => {
//     console.log('message: ' + msg);
//     // 메시지를 모든 클라이언트에게 보냅니다.
//     io.emit('chat message', msg);
//   });
// });
// Middleware to authenticate user from JWT token in socket handshake
// io.use(async (socket, next) => {
//   if (socket.handshake.query && socket.handshake.query.token) {
//     jwt.verify(socket.handshake.query.token, process.env.jwtSecretkey, async (err, decoded) => {
//       if (err) return next(new Error('Authentication error'));
//       let user = await User.findOne({ where: { userID: decoded.userID } });
//       if (!user) {
//         return next(new Error('Authentication error'));
//       }
//       socket.user = user;
//       next();
//     });
//   } else {
//     next(new Error('Authentication error'));
//   }
// });

// io.on('connection', (socket) => {
//   console.log('a user connected');
//   socket.on('good', ()=> {
//     console.log('user connected'); // 클라이언트 -> 서버
//   });

//   // console.log(socket);
//   socket.on('createRoom', (room) => createRoom(socket, room));
//   socket.on('getRooms', () => getRooms(socket));
//   socket.on('join', (data, callback) => join(socket, data, callback));
//   socket.on('sendMessage', (message, callback) => sendMessage(socket, message, callback));
//   socket.on('disconnect', () => disconnect(socket));

// });

module.exports = {
  getChatRoom,
  enterChatRoom,
  forcedExit,
  getOut,
  clickChatRoom,
};
