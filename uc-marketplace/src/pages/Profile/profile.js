import { useState } from "react";
import "./profile.css"


const Profile = ({ accountName }) => {
    const [isEditing, setIsEditing] = useState(false);

      const handleEditClick = () => {
        setIsEditing(true);
      };
    
      const handleSaveClick = () => {
        setIsEditing(false);
      };

      const handleInputChange = async (event) => {
        event.preventDefault();
        const res = await fetch("http://localhost:3001/user/{id}", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
                name: res.body.name
              }),
          }).then((res) => res.json());
      
          if (res.success) {
            console.log("Success", res);
      }
    }
        

    return <div id="profile" className="content">
    <h2 className="account-title">Profile</h2>
    {isEditing ? (
  <div className="profile-header">
    <label>Name</label>
    <input
      type="text"
      value={accountName}
      onChange={handleInputChange}
    />
    <button onClick={handleSaveClick}>Save</button>
  </div>
) : (
  <div className="profile-header">
    <label>Name</label>
    <p>{accountName}</p>
    <button onClick={handleEditClick}>Edit</button>
  </div>
)}
  </div>
}



export default Profile;
