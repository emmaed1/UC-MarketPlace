import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FriendsTab.css';

const FriendsTab = ({ accountName, onMessageFriend }) => {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [favorites, setFavorites] = useState([]);
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

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/favorites/${accountName}`);
        setFavorites(response.data);
      } catch (error) {
        console.error('Failed to fetch favorite friends:', error);
      }
    };

    fetchFavorites();
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

  const toggleFavorite = async (user) => {
    try {
      if (favorites.some(favorite => favorite.id === user.id)) {
        await axios.delete(`http://localhost:3001/favorites/${accountName}/${user.id}`);
        setFavorites(favorites.filter(favorite => favorite.id !== user.id));
      } else {
        const response = await axios.post(`http://localhost:3001/favorites/${accountName}`, { friendId: user.id });
        setFavorites([...favorites, response.data]);
      }
    } catch (error) {
      console.error('Failed to toggle favorite friend:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    !friends.some(friend => friend.id === user.id) &&
    user.name !== accountName 
  );

  return (
    <div id="friends" className="content">
      <h2>Favorite Friends</h2>
      {favorites.length === 0 ? (
        <p>No favorite friends yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map(favorite => (
            <div key={favorite.id} className="favorite-item">
              <div className="favorite-info">
                <strong>{favorite.name}</strong>
                <p>Email: {favorite.email}</p>
                <p>Phone: {favorite.phone}</p>
              </div>
              <div className="favorite-actions">
                <button className="message-button" onClick={() => onMessageFriend(favorite)}>Message</button>
                <button className="remove-button" onClick={() => removeFriend(favorite)}>Remove</button>
                <button className="favorite-button" onClick={() => toggleFavorite(favorite)}>
                  {favorites.some(favorite => favorite.id === favorite.id) ? "Unfavorite" : "Favorite"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <h2>Current Friends</h2>
      <div className="friends-grid">
        {friends.map(friend => (
          <div key={friend.id} className="friend-item">
            <div className="friend-info">
              <strong>{friend.name}</strong>
              <p>Email: {friend.email}</p>
              <p>Phone: {friend.phone}</p>
            </div>
            <div className="friend-actions">
              <button className="message-button" onClick={() => onMessageFriend(friend)}>Message</button>
              <button className="remove-button" onClick={() => removeFriend(friend)}>Remove</button>
              <button className="favorite-button" onClick={() => toggleFavorite(friend)}>
                {favorites.some(favorite => favorite.id === friend.id) ? "Unfavorite" : "Favorite"}
              </button>
            </div>
          </div>
        ))}
      </div>
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
          <div className="users-grid">
            {filteredUsers.map(user => (
              <div key={user.id} className="user-item">
                <span>{user.name}</span>
                <button className="add-button" onClick={() => addFriend(user)}>Add Friend</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsTab;