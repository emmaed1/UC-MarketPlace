import React, { useEffect, useState } from 'react';

const Chat = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:8080');
        setSocket(newSocket);

        newSocket.onopen = (event) => {
            console.log('Connection established');
            newSocket.send('Hello Server');
        };

        newSocket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        newSocket.onclose = (event) => {
            console.log('WebSocket Connection closed');
        };

        newSocket.onerror = (error) => {
            console.log('WebSocket Error:', error);
        };

        return () => newSocket.close();
    }, []);

    const sendMessage = () => {
        if (socket && message) {
            socket.send(message);
            setMessage('');
        }
    };

    return (
        <div>
            <h1>UC MarketPlace Chat</h1>
            <div id="chat">
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
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