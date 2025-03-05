import React, { useState, useEffect } from "react";
import "./ProfilePage.css"; // Import the CSS file for styling

export default function ProfilePage({ accountName, userData }) {
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        localStorage.setItem(`${accountName}_profilePhoto`, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const savedProfilePhoto = localStorage.getItem(`${accountName}_profilePhoto`);
    if (savedProfilePhoto) {
      setProfilePhoto(savedProfilePhoto);
    }
  }, [accountName]);

  return (
    <div className="profile-page">
      <h2>Profile Information</h2>
      <div className="profile-info">
        <div className="profile-photo">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" />
          ) : (
            <div className="placeholder-photo">No Photo</div>
          )}
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
        </div>
        <p><strong>Name:</strong> {accountName}</p>
        <p><strong>Email:</strong> {userData.email}</p>
      </div>
    </div>
  );
}