import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ChatPage.css'; // Import the CSS file

const Chat = ({ accountName }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [recipient, setRecipient] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [users, setUsers] = useState([]);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3001/user');
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:3001');
        setSocket(newSocket);

        newSocket.onopen = (event) => {
            console.log('Connection established');
            newSocket.send(JSON.stringify({ type: 'authenticate', token }));
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
    }, [token]);

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
        if (socket && message && recipient) {
            const messageData = { type: 'message', message, sender: accountName, recipient, token };
            socket.send(JSON.stringify(messageData));
            setMessage('');
        }
    };

    const selectChat = (chat) => {
        setSelectedChat(chat);
        setRecipient(chat.recipient);
        setMessages(chat.messages);
    };

    const loadPastMessages = async () => {
        if (recipient) {
            try {
                const response = await axios.get(`http://localhost:3001/messages/${recipient}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Failed to load past messages:', error);
            }
        }
    };

    return (
        <div id="chat">
            <h1>UC MarketPlace Chat</h1>
            <div id="chat-container">
                <div id="chat-list">
                    {chats.map((chat, index) => (
                        <div key={index} className="chat-item" onClick={() => selectChat(chat)}>
                            <strong>Chat with {chat.recipientName}</strong>
                        </div>
                    ))}
                </div>
                <div id="chat-messages">
                    <button onClick={loadPastMessages}>Load Past Messages</button>
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender === accountName ? 'sent' : 'received'}`}>
                            <strong>{msg.sender}:</strong> {msg.message}
                        </div>
                    ))}
                </div>
            </div>
            <div id="chat-input">
                <select
                    id="recipientSelect"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
                <input
                    id="messageInput"
                    type="text"
                    placeholder="Type your message here"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;