import React, { useState, useEffect, useRef, useContext } from 'react';
import './MessagingScreen.css';
import Context from './Context'; // Import Context

const MessagingScreen = () => {
  const userInfo = useContext(Context); // Use context to get userInfo
  const userId = userInfo?.userId; // Get userId from userInfo

  const [messages, setMessages] = useState([]); // Initialize as an empty array
  const [content, setContent] = useState('');
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [confirmation, setConfirmation] = useState(''); // Add state for confirmation message
  const ws = useRef(null);

  useEffect(() => {
    // Fetch previous messages
    fetch(`http://localhost:3001/messages/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          setMessages([]);
        }
      })
      .catch((err) => console.error('Error fetching messages:', err));

    // Fetch users
    fetch('http://localhost:3001/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error fetching users:', err));

    // Set up WebSocket connection
    ws.current = new WebSocket('ws://localhost:3001');
    ws.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return () => {
      ws.current.close();
    };
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = { senderId: userId, receiverId, content };
    ws.current.send(JSON.stringify(message));
    setContent('');
    setConfirmation('Message sent successfully!'); // Set confirmation message
    setTimeout(() => setConfirmation(''), 3000); // Clear confirmation message after 3 seconds
  };

  return (
    <div className="messaging-screen">
      {messages.length > 0 && (
        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="message-form">
        <select
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="receiver-select"
        >
          <option value="" disabled>Select a user to message</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message here"
          className="message-textarea"
        />
        <button type="submit" className="message-button">Send</button>
      </form>
      {confirmation && <p className="confirmation-message">{confirmation}</p>}
    </div>
  );
};

export default MessagingScreen;