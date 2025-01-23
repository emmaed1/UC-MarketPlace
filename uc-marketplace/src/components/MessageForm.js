import React, { useState } from "react";
import "./MessageForm.css"; // Import CSS file for styling

const MessageForm = ({ senderId, receiverId, productId }) => {
  const [content, setContent] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ senderId, receiverId, productId, content }),
    });
    const data = await response.json();
    console.log(data);
    setConfirmation("Message sent successfully!");
    setContent(""); // Clear the text area after sending the message
  };

  return (
    <div className="message-form-container">
      <form onSubmit={handleSubmit} className="message-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message here"
          className="message-textarea"
        />
        <button type="submit" className="message-button">Send Message</button>
      </form>
      {confirmation && <p className="confirmation-message">{confirmation}</p>}
    </div>
  );
};

export default MessageForm;