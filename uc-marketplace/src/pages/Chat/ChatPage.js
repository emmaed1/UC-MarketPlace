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
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3001/user');
                setUsers(response.data.filter(user => user.name !== accountName));
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        fetchUsers();
    }, [accountName]);

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

    const selectChat = async (user) => {
        setRecipient(user.id);
        setSelectedChat(user);
        try {
            const response = await axios.get(`http://localhost:3001/messages/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to load past messages:', error);
        }
    };

    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div id="chat">
            <h1>UC MarketPlace Chat</h1>
            <div id="chat-container">
                <div id="chat-list">
                    <input
                        type="text"
                        placeholder="Search users"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className={`chat-item ${selectedChat && selectedChat.id === user.id ? 'selected' : ''}`}
                            onClick={() => selectChat(user)}
                        >
                            <strong>{user.name}</strong>
                        </div>
                    ))}
                </div>
                <div id="chat-messages">
                    {selectedChat && (
                        <div className="chat-header">
                            <strong>Chatting with {selectedChat.name}</strong>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender.name === accountName ? 'sent' : 'received'}`}>
                            <strong>{msg.sender.name}:</strong> {msg.message}
                        </div>
                    ))}
                </div>
            </div>
            <div id="chat-input">
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