import React, { useState, useEffect } from "react";
import "./AccountView.css";
import logo from "../../assets/uc-MP-logo.png";
import ListingDetailsModal from "./ListingDetailsModal";
import Chat from "../Chat/ChatPage"; // Import the Chat component

export default function AccountView() {
  const [option, setOption] = useState("Profile");
  const [showModal, setShowModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [accountName, setAccountName] = useState("");

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

      <div id="friends" className="content">
        <p>Test Message Here</p>
      </div>

      {/* Chat Section */}
      <div id="chat" className="content">
        <Chat accountName={accountName} />
      </div>

      <div className="newlisting-reviews-container">
        <div className="newlisting">
          <h3 className="newlist-title">
            Have another product or service to sell?
          </h3>
          <a href="/new-listing">Create Listing</a>
        </div>
      </div>

      <ListingDetailsModal
        show={showModal}
        onClose={closeModal}
        listingId={selectedListingId}
      />
    </div>
  );
}