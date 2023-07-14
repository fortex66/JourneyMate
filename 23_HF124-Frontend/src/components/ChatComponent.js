import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const ChatComponent = () => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [userID, setUserID] = useState(null);
    const [chatUserID, setChatUserId] = useState(null);
    const [input, setInput] = useState('');

    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io.connect('/');

        socketRef.current.emit('getUsers');

        socketRef.current.on('users', (users) => {
            setUsers(users);
        });

        socketRef.current.on('message', (message) => {
            if (message.sender === userID || message.receiver === userID) {
                setMessages((oldMessages) => [...oldMessages, message]);
            }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [userID]);

    const handleClickUser = (userID) => {
        setChatUserId(userID);
        setMessages([]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        socketRef.current.emit('sendMessage', {
            senderId: userID,
            receiverId: chatUserID,
            text: input
        });
        setInput('');
    };

    return (
        <div>
            <div>
                <h2>Users</h2>
                <ul>
                    {users.map((user) => (
                        <li key={user.userID} onClick={() => handleClickUser(user.userID)}>{user.user}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Chat</h2>
                {messages.map((message, index) => (
                    <p key={index}>{`${message.Sender.user}: ${message.text}`}</p>
                ))}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        required
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export default ChatComponent;
