import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Chat = ({ accountName }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || ''); // Add token state

    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:3001');
        setSocket(newSocket);

        newSocket.onopen = (event) => {
            console.log('Connection established');
            newSocket.send(JSON.stringify({ type: 'info', message: 'Hello Server', sender: accountName, token }));
        };

        newSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message from server:', data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        newSocket.onclose = (event) => {
            console.log('WebSocket Connection closed');
        };

        newSocket.onerror = (error) => {
            console.log('WebSocket Error:', error);
        };

        return () => newSocket.close();
    }, [accountName, token]);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.post('http://localhost:3001/user/refresh-token', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const newToken = response.data.token;
                setToken(newToken);
                localStorage.setItem('token', newToken);
            } catch (error) {
                console.error('Failed to refresh token:', error);
            }
        }, 55 * 60 * 1000); // Refresh token every 55 minutes

        return () => clearInterval(interval);
    }, [token]);

    const sendMessage = () => {
        if (socket && message) {
            const messageData = { type: 'message', message, sender: accountName, token };
            socket.send(JSON.stringify(messageData));
            setMessage('');
        }
    };

    return (
        <div id="chat">
            <h1>UC MarketPlace Chat</h1>
            <div id="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <input
                id="messageInput"
                type="text"
                placeholder="Type your message here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;