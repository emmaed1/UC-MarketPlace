import React, { useState, useEffect } from "react";
import "./MyListingsTab.css";

export default function MyListingsTab({ accountName }) {
  const [listings, setListings] = useState([]);
  const [mainView, setMainView] = useState("all");
  const [subView, setSubView] = useState(null);

  useEffect(() => {
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

  const handleViewChange = (view) => {
    if (view === "products" || view === "services" || view === "all") {
      setMainView(view);
      setSubView(null);
    } else {
      setSubView(view);
    }
  };

  return (
    <div className="my-listings-tab">
      <h2>My Listings</h2>

      {mainView === "all" && (
        <>
          <div className="product-button-container">
            <button onClick={() => handleViewChange("products")}>Products</button>
            <button onClick={() => handleViewChange("services")}>Services</button>
          </div>
          <div className="newlisting-reviews-container">
            <div className="newlisting">
              <h3 className="newlist-title">
                Have another product or service to sell?
              </h3>
              <a href="/new-listing">Create Listing</a>
            </div>
          </div>
          <ul className="listings">
            {listings.map((listing) => (
              <li key={listing.id}>
                <h3>{listing.name}</h3>
                <p>{listing.description}</p>
                <p><strong>Price:</strong> ${listing.price}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      {mainView === "products" && (
        <div className = "listing-view">
        <div>
          <div>
            <button onClick={() => handleViewChange("all")}>All</button>
            <button onClick={() => handleViewChange("orders")}>Orders</button>
            <button onClick={() => handleViewChange("available")}>Available</button>
            <button onClick={() => handleViewChange("pending")}>Pending</button>
            <button onClick={() => handleViewChange("sold")}>Sold</button>
          </div>
          <div>
            {subView === "orders" && (
              <ul>
                <li>Order 1</li>
                <li>Order 2</li>
              </ul>
            )}
            {subView === "available" && (
              <ul>
                <li>Available Product 1</li>
                <li>Available Product 2</li>
              </ul>
            )}
            {subView === "pending" && (
              <ul>
                <li>Pending Product 1</li>
                <li>Pending Product 2</li>
              </ul>
            )}
            {subView === "sold" && (
              <ul>
                <li>Sold Product 1</li>
                <li>Sold Product 2</li>
              </ul>
            )}
          </div>
        </div>
        </div>
      )}

      {mainView === "services" && (
        <div>
          <div>
            <button onClick={() => handleViewChange("all")}>All</button>
            <button onClick={() => handleViewChange("all_services")}>All Services</button>
            <button onClick={() => handleViewChange("bookings")}>Bookings</button>
          </div>
          <div>
            {subView === "all_services" && (
              <ul>
                <li>Service 1</li>
                <li>Service 2</li>
              </ul>
            )}
            {subView === "bookings" && (
              <ul>
                <li>Booking 1</li>
                <li>Booking 2</li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}