import React, { useEffect, useState } from "react";

const MessagesList = ({ userId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`http://localhost:3001/messages/${userId}`);
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();
  }, [userId]);

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <p>From: {message.sender.name}</p>
          <p>To: {message.receiver.name}</p>
          <p>Product: {message.product.name}</p>
          <p>{message.content}</p>
          <p>{new Date(message.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;