const chatController=require('./controllers/chatController');
const chat =require("./models/chatModel")
module.exports = (io) =>{
    io.on("connection",(socket)=>{
    console.log("Socket Connection");
    const userID=socket.decoded.userID;

  
    socket.on('init',async()=>{
      const rooms = await chatController.getChatRoomByUserId(userID);

      // 조회한 채팅방들에 join
      for (let room of rooms) {
        socket.join(room.chatID);
        console.log(io.sockets.adapter.rooms.get(room.chatID))
      }
    });
  
    socket.on('chat_message', async (data) => {
      const roomID = Number(data.roomID);

      const text=data.content;
    //DB에 메세지 저장
      const saveMessage=await chat.Message.create({
        content: data.content,
        sendtime: new Date(),
        chatID: data.roomID,
        userID: userID
      })
      socket.broadcast.to(roomID).emit('chat_message', {roomID: roomID, userID: userID, message: text});
      console.log(io.sockets.adapter.rooms.get(roomID))
      
  });
  
    socket.on('disconnect', async () => {
        console.log('user disconnected');
    });
  
  })
};