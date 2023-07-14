const express = require('express');
const chatController = require("../controllers/chatController");
const router = express.Router();

// 채팅방 관리를 위한 객체
// const chatRooms = {};

// // 날짜 포맷팅 함수
// function formatDate(timestamp) {
//   const date = new Date(timestamp);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   const hours = String(date.getHours()).padStart(2, '0');
//   const minutes = String(date.getMinutes()).padStart(2, '0');
//   const seconds = String(date.getSeconds()).padStart(2, '0');

//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// }

// // 채팅 라우트 - 사용자별 채팅방 생성 및 가져오기
// router.get('/chatting/:senderID/:receiverID', (req, res, next) => {
//   const { senderID, receiverID } = req.params;
//   console.log('Sender ID:', senderID);
//   console.log('Receiver ID:', receiverID);
//   // 사용자별로 채팅방 생성 또는 가져오기
//   if (!chatRooms[senderID]) {
//     chatRooms[senderID] = {};
//   }
//   if (!chatRooms[senderID][receiverID]) {
//     chatRooms[senderID][receiverID] = [];
//   }
//   if (chatRooms[senderID] && chatRooms[senderID][receiverID]) {
//     const userChatRoom = chatRooms[senderID][receiverID];
//     console.log(userChatRoom);
//   }

//   next();
// }, (req, res) => {
//   const { senderID, receiverID } = req.params;
//   res.json(chatRooms[senderID][receiverID]);
// });

// // 채팅 라우트 - 특정 사용자에게 채팅 메시지 전송
// router.post('/chatting/:senderID/:receiverID', (req, res, next) => {
//   const { senderID, receiverID } = req.params;
//   const { message } = req.body;
//   console.log('Sender ID:', senderID, 'contents:', message);
//   console.log('Receiver ID:', receiverID, 'contents:', message);
//   if (message) {
//     // 특정 사용자의 채팅방에 메시지 추가
//     if (!chatRooms[senderID]) {
//       chatRooms[senderID] = {};
//     }
//     if (!chatRooms[senderID][receiverID]) {
//       chatRooms[senderID][receiverID] = [];
//     }

//     // 현재 시간을 가져와 timestamp와 함께 메시지 추가
//     const timestamp = new Date().getTime();
//     const formattedTimestamp = formatDate(timestamp);
//     chatRooms[senderID][receiverID].push({ senderID, receiverID, message, timestamp: formattedTimestamp });

//     // 연결된 모든 클라이언트에게 메시지 전송
//     const broadcastMessage = JSON.stringify({ senderID, receiverID, message, timestamp: formattedTimestamp });
//     clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(broadcastMessage);
//       }
//     });

//     next();
//   } else {
//     res.status(400).json({ success: false, message: 'Message is required.' });
//   }
// }, (req, res) => {
//   res.status(201).json({ success: true, message: 'Chat message added.' });
// });

// // Express 애플리케이션의 HTTP 서버를 생성
// const server = router.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// // 웹소켓 서버를 HTTP 서버와 연결
// server.on('upgrade', (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, (ws) => {
//     wss.emit('connection', ws, request);
//   });
// });

module.exports = router;
