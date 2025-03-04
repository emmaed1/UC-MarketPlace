import React, { useState, useEffect } from "react";
import "./MyListingsTab.css";

export default function MyListingsTab({ accountName }) {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch user's listings from the server
    const fetchListings = async () => {
      try {
        const response = await fetch(`/api/listings?user=${accountName}`);
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [accountName]);

  return (
    <div className="my-listings-tab">
      <h2>My Listings</h2>
      <ul className="listings">
        {listings.map((listing) => (
          <li key={listing.id}>
            <h3>{listing.name}</h3>
            <p>{listing.description}</p>
            <p><strong>Price:</strong> ${listing.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}