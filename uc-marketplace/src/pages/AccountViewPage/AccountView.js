import React, { useState, useEffect } from "react";
import "./AccountView.css";
import logo from "../../assets/uc-MP-logo.png";
import ListingDetailsModal from "./ListingDetailsModal";
import Chat from "../Chat/ChatPage";
import FriendsTab from "./FriendsTab";

export default function AccountView() {
  const [option, setOption] = useState("Profile");
  const [showModal, setShowModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [accountName, setAccountName] = useState("");
  const [selectedChatUser, setSelectedChatUser] = useState(null);

  useEffect(() => {
    const accountInfo = sessionStorage.getItem("token");
    if (accountInfo) {
      const parsedInfo = JSON.parse(accountInfo);
      if (parsedInfo.name) {
        console.log(parsedInfo.name);
        setAccountName(parsedInfo.name);
      }
    }
  }, []);

  const openModal = (id) => {
    setSelectedListingId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedListingId(null);
  };

  const handleMessageFriend = (friend) => {
    setSelectedChatUser(friend);
    setOption("Messages");
  };

  return (
    <div className="account-content">
      <div className="welcome-content">
        <img src={logo} alt="uc marketplace-logo" />
        <div className="welcome-text">
          <h1>Welcome to your account, {accountName}</h1>
        </div>
      </div>
      <div className="nav">
        <ul className="options">
          <li
            onClick={() => {
              setOption("Profile");
            }}
          >
            <a href="#profile" className="menu-item">
              Profile
            </a>
          </li>
          <li
            onClick={() => {
              setOption("My Listings");
            }}
          >
            <a href="#listings" className="menu-item">
              My Listings
            </a>
          </li>
          <li
            onClick={() => {
              setOption("Messages");
            }}
          >
            <a href="#messages" className="menu-item">
              Messages
            </a>
          </li>
          <li
            onClick={() => {
              setOption("Security");
            }}
          >
            <a href="#security" className="menu-item">
              Security
            </a>
          </li>
          <li
            onClick={() => {
              setOption("Friends");
            }}
          >
            <a href="#friends" className="menu-item">
              Friends
            </a>
          </li>
        </ul>
      </div>

      {/* Chat Section */}
      {option === "Messages" && (
        <div id="chat" className="content">
          <Chat accountName={accountName} selectedChatUser={selectedChatUser} />
        </div>
      )}

      {/* Friends Section */}
      {option === "Friends" && (
        <FriendsTab accountName={accountName} onMessageFriend={handleMessageFriend} />
      )}

      {option !== "Messages" && option !== "Friends" && (
        <div className="newlisting-reviews-container">
          <div className="newlisting">
            <h3 className="newlist-title">
              Have another product or service to sell?
            </h3>
            <a href="/new-listing">Create Listing</a>
          </div>
        </div>
      )}

      <ListingDetailsModal
        show={showModal}
        onClose={closeModal}
        listingId={selectedListingId}
      />
    </div>
  );
}