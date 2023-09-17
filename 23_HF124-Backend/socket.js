const chatController = require("./controllers/chatController");
const chat = require("./models/chatModel");
const user = require("./models/userModel");
const {chatting}=require("./config");
const auth = require("./middleware/authMiddlewareForSocket");
module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, { 
      cors: {
          origin: "http://localhost:3001",
          methods: ["GET", "POST"], // 초기 연결할때 handshake용
          credentials: true,
        }, });
    // ... 여기에 원래 있던 socket 설정 코드
    io.use(auth);
    
    io.on("connection", (socket) => {
      console.log("Socket Connection");
      const userID = socket.decoded.userID;
      
  
      socket.on("init", async () => {
        const rooms = await chatController.getChatRoomByUserId(userID);
  
        // 조회한 채팅방들에 join
        for (let room of rooms) {
          socket.join(room.chatID);
          console.log(io.sockets.adapter.rooms.get(room.chatID));
        }
      });

      socket.on("chat_image", async(data)=>{
        
      })
      socket.on("chat_message", async (data) => {
        const roomID = Number(data.roomID);
  
        const text = data.content;
        //DB에 메세지 저장
        const saveMessage = await chat.Message.create({
          content: data.content,
          sendtime: new Date(),
          chatID: data.roomID,
          userID: userID,
          messageType: 0 // 0이면 텍스트
        });
        const chatTime=await saveMessage.getDataValue("sendtime");

        await chat.GroupChat.update(
          { 
            chattime: chatTime, 
            lastchat: data.content 
          },
          { 
            where: { chatID: data.roomID } 
          }
        );
        

        const profileImage = await user.findOne({
          attributes: ["profileImage"],
          where: { userID: userID },
        });
        socket.broadcast
          .to(roomID)
          .emit("chat_message", {
            roomID: roomID,
            userID: userID,
            message: text,
            messageType: 0,
            profileImage: profileImage,
          });
        console.log(io.sockets.adapter.rooms.get(roomID));
      });
  
      socket.on("disconnect", async () => {
        console.log("user disconnected");
      });
    });
  },
  getIo: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
  
}
