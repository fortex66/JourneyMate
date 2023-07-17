import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('/'); // Connect to the server.

    socketRef.current.on('message', ({ message }) => {
      setChat([...chat, message]);
    });

    // Clean up function.
    return () => socketRef.current.disconnect();
  }, [chat]);

  const onTextChange = (e) => {
    setMessage(e.target.value);
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();

    const msg = { message };
    socketRef.current.emit('message', msg);
    setMessage('');
  };

  return (
    <div>
      <h2>Chat</h2>
      {chat.map((message, idx) => (
        <div key={idx}>{message}</div>
      ))}
      <form onSubmit={onMessageSubmit}>
        <input
          name="message"
          onChange={(e) => onTextChange(e)}
          value={message}
          label="Message"
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default ChatComponent;
