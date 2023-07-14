import React from 'react';
import Navigationbar from '../components/Navigationbar';
import ChatComponent from '../components/ChatComponent';

const Chat = () => {
  return (
    <div>
      <h1>Chat</h1>
      <p>채팅페이지입니다.</p>
      <ChatComponent /> {/* ChatComponent를 올바르게 가져오도록 수정 */}
      <Navigationbar />
    </div>
  );
};

export default Chat;
