import React, { useState, useEffect } from "react";
import "./AccountView.css";
import logo from "../../assets/uc-MP-logo.png";
import ListingDetailsModal from "./ListingDetailsModal";

export default function AccountView() {
  const [option, setOption] = useState("Profile");
  const [showModal, setShowModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [accountName, setAccountName] = useState();

  useEffect(() => {
    const accountInfo = sessionStorage.getItem("token");
    if (JSON.parse(accountInfo).name) {
      console.log(JSON.parse(accountInfo).name);
      setAccountName(JSON.parse(accountInfo).name);
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

      {/* <div className="listings">
        <h3 className="list-title">View Your Current Listings</h3>
        <ul className="list-items">
          {[1, 2, 3].map(id => (
            <li key={id}>
              <div className="imgresize">
                <img src={logo} alt={`Listing ${id} Image`} />
              </div>
              {/* Open the modal when the link is clicked *}
              <a href="#" onClick={() => openModal(id)}>Listing {id}</a>
            </li>
          ))}
        </ul>
      </div> */}

      <div className="newlisting-reviews-container">
        <div className="newlisting">
          <h3 className="newlist-title">
            Have another product or service to sell?
          </h3>
          <a href="/new-listing">Create Listing</a>
        </div>

        {/* <div className="reviews">
          <h2>Seller Reviews</h2>
          <p>Hear from students who have purchased from this seller.</p>
          <div className="review-cards">
            <table>
              <thead>
                <tr className="review-header">
                  <th>Student 1</th>
                  <th>Student 2</th>
                  <th>Student 3</th>
                </tr>
              </thead>
              <tbody>
                <tr className="review-content">
                  <td>great!</td>
                  <td>awesome!</td>
                  <td>cool!</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> */}
      </div>

      {/* <div className="faq">
        <h2>Frequently Asked Questions</h2>
        <p>Find answers to common questions about our platform and services.</p>
        <div className="faq-cards"></div>
      </div> */}

      {/* Modal for listing details */}
      <ListingDetailsModal
        show={showModal}
        onClose={closeModal}
        listingId={selectedListingId}
      />
    </div>
  );
}
