import React, { useState, useEffect } from "react";
import "./MyListingsTab.css";
import ServicesCard from "../ServicesPage/servicesCard";

// Custom Product Card component without Add to Cart and View More buttons
const ListingProductCard = ({ productId, name, desc, price, img, categories }) => {
  return (
    <div className="listing-card">
      <img src={img} alt={name} />
      <h4>{name}</h4>
      <p>{desc}</p>
      <div className="price">${price.toLocaleString()}</div>
      <div className="categories">
        {categories && categories.length ? categories.map(c => c.name).join(", ") : "No Category"}
      </div>
    </div>
  );
};

// Custom Service Card component without Add to Cart and View More buttons
const ListingServiceCard = ({ serviceId, name, desc, price, img, categories }) => {
  return (
    <div className="listing-card">
      <img src={img} alt={name} />
      <h4>{name}</h4>
      <p>{desc}</p>
      <div className="price">${price.toLocaleString()}</div>
      <div className="categories">
        {categories && categories.length ? categories.map(c => c.name).join(", ") : "No Category"}
      </div>
    </div>
  );
};

export default function MyListingsTab({ userId }) {
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [mainView, setMainView] = useState("all");
    const [subView, setSubView] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("MyListingsTab mounted with userId:", userId);

        const fetchProducts = async () => {
            if (userId) {
                setLoading(true);
                setError(null);
                try {
                    // Get the token from sessionStorage
                    const accountInfo = sessionStorage.getItem("token");
                    if (!accountInfo) {
                        setError("Authentication token not found. Please log in again.");
                        setLoading(false);
                        return;
                    }

                    const parsedInfo = JSON.parse(accountInfo);
                    const token = parsedInfo.token;
                    
                    console.log("Fetching products for userId:", userId);
                    const response = await fetch(`http://localhost:3001/api/listings/products`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        setError(`Error fetching products. Status: ${response.status}. ${errorData?.error || 'Unknown error'}`);
                        console.error("Error fetching products. Status:", response.status, "Error data:", errorData);
                        return;
                    }
                    const data = await response.json();
                    console.log("Products data:", data);
                    setProducts(data);
                } catch (err) {
                    setError("Failed to fetch products. Please try again.");
                    console.error("Error fetching products:", err);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log("UserID is not available for products.");
                setError("User ID is not available. Please log in again.");
            }
        };

        const fetchServices = async () => {
            if (userId) {
                setLoading(true);
                setError(null);
                try {
                    // Get the token from sessionStorage
                    const accountInfo = sessionStorage.getItem("token");
                    if (!accountInfo) {
                        setError("Authentication token not found. Please log in again.");
                        setLoading(false);
                        return;
                    }

                    const parsedInfo = JSON.parse(accountInfo);
                    const token = parsedInfo.token;
                    
                    console.log("Fetching services for userId:", userId);
                    const response = await fetch(`http://localhost:3001/api/listings/services`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json();
                        setError(`Error fetching services. Status: ${response.status}. ${errorData?.error || 'Unknown error'}`);
                        console.error("Error fetching services. Status:", response.status, "Error data:", errorData);
                        return;
                    }
                    const data = await response.json();
                    console.log("Services data:", data);
                    setServices(data);
                } catch (err) {
                    setError("Failed to fetch services. Please try again.");
                    console.error("Error fetching services:", err);
                } finally {
                    setLoading(false);
                }
            } else {
                console.log("UserID is not available for services.");
                setError("User ID is not available. Please log in again.");
            }
        };

        if (mainView === "products" && subView === "all_products") {
            fetchProducts();
        } else if (mainView === "services" && subView === "all_services") {
            fetchServices();
        }
    }, [userId, mainView, subView]);

    const handleViewChange = (view) => {
        console.log("View changed to:", view);
        setMainView(view);
        setSubView(null);

        if (view === "products") {
            setSubView("all_products");
        } else if (view === "services") {
            setSubView("all_services");
        }
    };

    return (
        <div className="my-listings-tab">
            <h2>My Listings</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}

            {mainView === "all" && (
                <>
                    <div className="product-button-container">
                        <button onClick={() => handleViewChange("products")}>Products</button>
                        <button onClick={() => handleViewChange("services")}>Services</button>
                    </div>
                    <div className="newlisting-reviews-container">
                        <div className="newlisting">
                            <h3 className="newlist-title">Have another product or service to sell?</h3>
                            <a href="/new-listing">Create Listing</a>
                        </div>
                    </div>
                </>
            )}

            {mainView === "products" && (
                <div className="listing-view">
                    <div className="listing-nav">
                        <button onClick={() => handleViewChange("all")}>Back</button>
                        <button onClick={() => setSubView("all_products")}>All Products</button>
                        <button onClick={() => setSubView("orders")}>Orders</button>
                        <button onClick={() => setSubView("available")}>Available</button>
                        <button onClick={() => setSubView("pending")}>Pending</button>
                        <button onClick={() => setSubView("sold")}>Sold</button>
                    </div>
                    <div className="listing-content">
                        {subView === "all_products" && (
                            <div className="products-content">
                                {products.length > 0 ? (
                                    products.map((item) => (
                                        <ListingProductCard key={item.productId} {...item} />
                                    ))
                                ) : (
                                    <p>You have no products listed.</p>
                                )}
                            </div>
                        )}
                        {subView === "orders" && (<ul><li>Order 1</li><li>Order 2</li></ul>)}
                        {subView === "available" && (<ul><li>Available Product 1</li><li>Available Product 2</li></ul>)}
                        {subView === "pending" && (<ul><li>Pending Product 1</li><li>Pending Product 2</li></ul>)}
                        {subView === "sold" && (<ul><li>Sold Product 1</li><li>Sold Product 2</li></ul>)}
                    </div>
                </div>
            )}

            {mainView === "services" && (
                <div className="listing-view">
                    <div className="listing-nav">
                        <button onClick={() => handleViewChange("all")}>Back</button>
                        <button onClick={() => setSubView("all_services")}>All Services</button>
                        <button onClick={() => setSubView("bookings")}>Bookings</button>
                    </div>
                    <div className="listing-content">
                        {subView === "all_services" && (
                            <div className="services-content">
                                {services.length > 0 ? (
                                    services.map((item) => (
                                        <ListingServiceCard key={item.serviceId} {...item} />
                                    ))
                                ) : (
                                    <p>You have no services listed.</p>
                                )}
                            </div>
                        )}
                        {subView === "bookings" && (<ul><li>Booking a</li><li>Booking 2</li></ul>)}
                    </div>
                </div>
            )}
        </div>
    );
}