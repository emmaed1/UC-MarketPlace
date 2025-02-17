import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FriendsTab.css'; // Import the CSS file for styling

const FriendsTab = ({ accountName, onMessageFriend }) => {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/friends/${accountName}`);
        setFriends(response.data);
      } catch (error) {
        console.error('Failed to fetch friends:', error);
      }
    };

    fetchFriends();
  }, [accountName]);

  const addFriend = async (user) => {
    try {
      const response = await axios.post(`http://localhost:3001/friends/${accountName}`, { friendId: user.id });
      setFriends([...friends, response.data]);
    } catch (error) {
      console.error('Failed to add friend:', error);
    }
  };

  const removeFriend = async (user) => {
    try {
      await axios.delete(`http://localhost:3001/friends/${accountName}/${user.id}`);
      setFriends(friends.filter(friend => friend.id !== user.id));
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !friends.some(friend => friend.id === user.id) &&
    user.name !== accountName // Exclude the logged-in user
  );

  return (
    <div id="friends" className="content">
      <h2>Current Friends</h2>
      <ul className="friends-list">
        {friends.map(friend => (
          <li key={friend.id} className="friend-item">
            <div className="friend-info">
              <strong>{friend.name}</strong>
              <p>Email: {friend.email}</p>
              <p>Phone: {friend.phone}</p>
            </div>
            <div className="friend-actions">
              <button className="message-button" onClick={() => onMessageFriend(friend)}>Message</button>
              <button className="remove-button" onClick={() => removeFriend(friend)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
      <button className="toggle-button" onClick={() => setShowAddFriends(!showAddFriends)}>
        {showAddFriends ? "Hide Add Friends" : "Add New Friends"}
      </button>
      {showAddFriends && (
        <div className="add-friends-section">
          <h3>All Users</h3>
          <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <ul className="users-list">
            {filteredUsers.map(user => (
              <li key={user.id} className="user-item">
                <span>{user.name}</span>
                <button className="add-button" onClick={() => addFriend(user)}>Add Friend</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FriendsTab;