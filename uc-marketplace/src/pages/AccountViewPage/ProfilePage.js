import React, { useState, useEffect } from "react";
import "./ProfilePage.css"; // Import the CSS file for styling

export default function ProfilePage({ accountName, userData, onUserDataChange }) {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState("");

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setOriginalName(userData.name);
    }
  }, [userData]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        setProfilePhoto(reader.result);
        localStorage.setItem(`${accountName}_profilePhoto`, reader.result);
      } catch (error) {
        if (error.name === "QuotaExceededError") {
          alert("Unable to save photo. Local storage quota exceeded.");
        } else {
          console.error("Error saving photo:", error);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const savedProfilePhoto = localStorage.getItem(`${accountName}_profilePhoto`);
    if (savedProfilePhoto) {
      setProfilePhoto(savedProfilePhoto);
    }
  }, [accountName]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setName(originalName);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/updateUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountName, name }),
      });
      const text = await response.text();
      console.log("Server response:", text);
      const data = JSON.parse(text);
      if (data.success) {
        setIsEditing(false);
        console.log("User information updated successfully");
        const updatedUserData = { name };
        onUserDataChange(updatedUserData); // Notify parent component
        sessionStorage.setItem("token", JSON.stringify({ ...userData, ...updatedUserData })); // Save updated user data to session storage
        // Reset profile photo if name is changed
        if (accountName !== name) {
          setProfilePhoto(null);
          localStorage.removeItem(`${accountName}_profilePhoto`);
        }
      } else {
        console.error("Error updating user information:", data.error, data.details);
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

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
          {isEditing && (
            <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          )}
        </div>
        <div className="profile-details">
          {isEditing ? (
            <>
              <p>
                <strong>Name:</strong>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </p>
              <p className="notice">
                Note: Changing your name will reset your profile photo.
              </p>
              <button onClick={handleSaveClick}>Save</button>
              <button onClick={handleCancelClick} className="cancel-button">Cancel</button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <button onClick={handleEditClick}>Edit</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}