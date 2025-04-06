import React, { useState, useEffect } from "react";
import "./AccountView.css";
import logo from "../../assets/uc-MP-logo.png";
import ListingDetailsModal from "./ListingDetailsModal";
import Chat from "../Chat/ChatPage";
import FriendsTab from "./FriendsTab";
import ProfilePage from "./ProfilePage";
import SecurityTab from "./SecurityTab";
import MyListingsTab from "./MyListingsTab";
import { useLocation } from "react-router-dom"; // Added import
import axios from "axios"; // Added import

export default function AccountView() {
  const [option, setOption] = useState("Profile");
  const [showModal, setShowModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [accountName, setAccountName] = useState("");
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [productView, setProductView] = useState("all");
  const [serviceView, setServiceView] = useState("all");
  const location = useLocation(); // Added location state

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
  }, [location.search]); // Added useEffect to handle sellerName query parameter

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

  const handleProductViewChange = (view) => {
    if (view === "all") {
      setOption("My Listings");
    } else {
      setProductView(view);
      setOption("Products");
    }
  };

  const handleServiceViewChange = (view) => {
    if (view === "all") {
      setOption("My Services");
    } else {
      setServiceView(view);
      setOption("Services");
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
          <Chat accountName={accountName} selectedChatUser={selectedChatUser} /> {/* selectedChatUser prop added */}
        </div>
      )}

      {option === "Friends" && (
        <FriendsTab accountName={accountName} onMessageFriend={handleMessageFriend} />
      )}

      {option === "Security" && (
        <SecurityTab accountName={accountName} />
      )}

      {option === "My Listings" && (
        <div>
          <MyListingsTab accountName={accountName} />
          <div className="product-button-container">
            <button className="product-view-nav-button" onClick={() => handleProductViewChange("all")}>All</button>
            <button className="product-view-nav-button" onClick={() => handleProductViewChange("products")}>Products</button>
            <button className="product-view-nav-button" onClick={() => handleServiceViewChange("services")}>Services</button>
          </div>
          <div className="newlisting-reviews-container">
            <div className="newlisting">
              <h3 className="newlist-title">
                Have another product or service to sell?
              </h3>
              <a href="/new-listing">Create Listing</a>
            </div>
          </div>
        </div>
      )}

      {option === "Products" && (
        <div className="product-view">
          <div className="product-view-nav">
            <button className="product-view-nav-button" onClick={() => handleProductViewChange("all")}>All</button>
            <button className="product-view-nav-button" onClick={() => setProductView("orders")}>Orders</button>
            <button className="product-view-nav-button" onClick={() => setProductView("available")}>Available</button>
            <button className="product-view-nav-button" onClick={() => setProductView("pending")}>Pending</button>
            <button className="product-view-nav-button" onClick={() => setProductView("sold")}>Sold</button>
          </div>
          <div className="product-list">
            {productView === "orders" && (
              <ul>
                <li>Order 1</li>
                <li>Order 2</li>
              </ul>
            )}
            {productView === "available" && (
              <ul>
                <li>Available Product 1</li>
                <li>Available Product 2</li>
              </ul>
            )}
            {productView === "pending" && (
              <ul>
                <li>Pending Product 1</li>
                <li>Pending Product 2</li>
              </ul>
            )}
            {productView === "sold" && (
              <ul>
                <li>Sold Product 1</li>
                <li>Sold Product 2</li>
              </ul>
            )}
          </div>
        </div>
      )}

      {option === "Services" && (
        <div className="product-view">
          <div className="product-view-nav">
            <button className="product-view-nav-button" onClick={() => handleProductViewChange("all")}>All</button>
            <button className="product-view-nav-button" onClick={() => handleServiceViewChange("services")}>All Services</button>
            <button className="product-view-nav-button" onClick={() => setServiceView("bookings")}>Bookings</button>
          </div>
          <div className="product-list">
            {serviceView === "bookings" && (
              <ul>
                <li>Booking 1</li>
                <li>Booking 2</li>
              </ul>
            )}
            {serviceView === "services" && (
              <ul>
                <li>Service 1</li>
                <li>Service 2</li>
              </ul>
            )}
          </div>
        </div>
      )}

      <ListingDetailsModal show={showModal} onClose={closeModal} listingId={selectedListingId} />
    </div>
  );
}