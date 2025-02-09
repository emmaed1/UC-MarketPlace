import React, { useEffect, useState } from 'react';

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('User'); // Default username, you can change this

    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:3001');
        setSocket(newSocket);

        newSocket.onopen = (event) => {
            console.log('Connection established');
            newSocket.send(JSON.stringify({ type: 'info', message: 'Hello Server', sender: username }));
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
    }, [username]);

    const sendMessage = () => {
        if (socket && message) {
            const messageData = { type: 'message', message, sender: username };
            socket.send(JSON.stringify(messageData));
            setMessage('');
        }
    };

    return (
        <div>
            <h1>UC MarketPlace Chat</h1>
            <div id="chat">
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