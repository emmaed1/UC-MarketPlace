import React from "react";
import "./ProfilePage.css"; // Import the CSS file for styling

export default function ProfilePage({ accountName, userData }) {
  return (
    <div className="profile-page">
      <h2>Profile Information</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {accountName}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone:</strong> {userData.phone}</p>
        <p><strong>Address:</strong> {userData.address}</p>
        <p><strong>Joined Date:</strong> {userData.joinedDate}</p>
      </div>
    </div>
  );
}