
import Navigationbar from '../components/Navigationbar';
import ChatComponent from '../components/ChatComponent';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Chat = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch(`/api/rooms/${roomId}/messages`)
      .then(res => res.json())
      .then(setMessages);
  }, [roomId]);

  useEffect(() => {
    const socket = io();
    socket.on('newMessage', (message) => {
      setMessages(messages => [...messages, message]);
    });
    return () => socket.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/rooms/${roomId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    setInput('');
  };

  return (
    <div>
      {messages.map((message, i) => (
        <div key={i}>{message}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
