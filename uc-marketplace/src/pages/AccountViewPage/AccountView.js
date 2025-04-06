import React, { useState, useEffect } from "react";
import "./AccountView.css";
import logo from "../../assets/uc-MP-logo.png";
import ListingDetailsModal from "./ListingDetailsModal";
import Chat from "../Chat/ChatPage";
import FriendsTab from "./FriendsTab";
import ProfilePage from "./ProfilePage";
import SecurityTab from "./SecurityTab";
import MyListingsTab from "./MyListingsTab";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function AccountView() {
  const [option, setOption] = useState("Profile");
  const [showModal, setShowModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [accountName, setAccountName] = useState("");
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [userData, setUserData] = useState({});
  const location = useLocation();

  useEffect(() => {
    const accountInfo = sessionStorage.getItem("token");
    if (accountInfo) {
      const parsedInfo = JSON.parse(accountInfo);
      if (parsedInfo.name) {
        setAccountName(parsedInfo.name);
        setUserData(parsedInfo);
      }
    }
  }, []);

  useEffect(() => {
    const sellerName = new URLSearchParams(location.search).get("sellerName");
    if (sellerName) {
      const fetchSeller = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/user?name=${sellerName}`
          );
          if (response.data && response.data.length > 0) {
            setSelectedChatUser(response.data[0]);
            setOption("Messages");
          }
        } catch (error) {
          console.error("Failed to fetch seller:", error);
        }
      };
      fetchSeller();
    }
  }, [location.search]);

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

  const handleUserDataChange = (updatedUserData) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      ...updatedUserData,
    }));
    if (updatedUserData.name) {
      setAccountName(updatedUserData.name);
    }
  };

  return (
    <div className="account-content">
      <div className="welcome-content">
        <img src={logo} alt="uc marketplace-logo" />
        <div className="welcome-text">
          <h1>Welcome to your account, {userData.name}</h1>
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

      {option === "Profile" && (
        <ProfilePage accountName={accountName} userData={userData} onUserDataChange={handleUserDataChange} />
      )}

      {option === "Messages" && (
        <div id="chat" className="content">
          <Chat accountName={accountName} selectedChatUser={selectedChatUser} />
        </div>
      )}

      {option === "Friends" && (
        <FriendsTab accountName={accountName} onMessageFriend={handleMessageFriend} />
      )}

      {option === "Security" && (
        <SecurityTab accountName={accountName} />
      )}

      {option === "My Listings" && (
        <MyListingsTab accountName={accountName} />
      )}

      <ListingDetailsModal show={showModal} onClose={closeModal} listingId={selectedListingId} />
    </div>
  );
}