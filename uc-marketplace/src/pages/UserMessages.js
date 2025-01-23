import React from "react";
import MessagesList from "../components/MessagesList";

const UserMessages = ({ userId }) => {
  return (
    <div>
      <h1>Your Messages</h1>
      <MessagesList userId={userId} />
    </div>
  );
};

export default UserMessages;