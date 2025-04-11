import React, { useState, useEffect } from "react";
import "./MyListingsTab.css";
import ServicesCard from "../ServicesPage/servicesCard";

// Custom Product Card component without Add to Cart and View More buttons
const ListingProductCard = ({ productId, name, desc, price, img, categories, status: initialStatus, onProductUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    name,
    desc,
    price,
    img,
    categories
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(initialStatus || "unavailable");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Update status if initialStatus changes
  useEffect(() => {
    if (initialStatus) {
      setStatus(initialStatus);
    } else {
      setStatus("unavailable"); // Default for products without status
    }
  }, [initialStatus]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProduct({
      name,
      desc,
      price,
      img,
      categories
    });
    setError(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the token from sessionStorage
      const accountInfo = sessionStorage.getItem("token");
      if (!accountInfo) {
        setError("Authentication token not found. Please log in again.");
        setIsLoading(false);
        return;
      }

      const parsedInfo = JSON.parse(accountInfo);
      const token = parsedInfo.token;
      
      // Create form data for the update
      const formData = new FormData();
      formData.append('name', editedProduct.name);
      formData.append('desc', editedProduct.desc);
      formData.append('price', editedProduct.price);
      
      // If there's a new image file, append it
      if (editedProduct.newImage) {
        formData.append('image', editedProduct.newImage);
      }
      
      // Make the API call to update the product
      const response = await fetch(`http://localhost:3001/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Failed to update product');
      }
      
      // Get the updated product data
      const updatedProduct = await response.json();
      
      // Show success alert
      alert("Product updated successfully!");
      
      // Exit edit mode
      setIsEditing(false);
      
      // Call the parent component's callback to refresh the product list
      if (onProductUpdated) {
        onProductUpdated(updatedProduct);
      }
      
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.message || "Failed to update product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the token from sessionStorage
      const accountInfo = sessionStorage.getItem("token");
      if (!accountInfo) {
        setError("Authentication token not found. Please log in again.");
        setIsLoading(false);
        return;
      }

      const parsedInfo = JSON.parse(accountInfo);
      const token = parsedInfo.token;
      
      // Make the API call to delete the product
      const response = await fetch(`http://localhost:3001/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Failed to delete product');
      }
      
      // Show success alert
      alert("Product deleted successfully!");
      
      // Refresh the page to update the product list
      window.location.reload();
      
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err.message || "Failed to delete product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedProduct(prev => ({
        ...prev,
        newImage: file
      }));
    }
  };

  const toggleStatusDropdown = () => {
    setIsStatusDropdownOpen(!isStatusDropdownOpen);
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    setIsStatusDropdownOpen(false);
    
    try {
      // Get the token from sessionStorage
      const accountInfo = sessionStorage.getItem("token");
      if (!accountInfo) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      const parsedInfo = JSON.parse(accountInfo);
      const token = parsedInfo.token;
      
      // Make the API call to update the product status
      const response = await fetch(`http://localhost:3001/products/${productId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Failed to update product status');
      }
      
      // Get the updated product data
      const updatedProduct = await response.json();
      
      // Call the parent component's callback to refresh the product list
      if (onProductUpdated) {
        onProductUpdated(updatedProduct);
      }
      
    } catch (err) {
      console.error("Error updating product status:", err);
      setError(err.message || "Failed to update product status. Please try again.");
    }
  };

  return (
    <div className="listing-card">
      {isEditing ? (
        <div className="edit-mode">
          <h3>Edit Product</h3>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedProduct.name}
              onChange={handleInputChange}
              placeholder="Enter Product Name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="desc">Description:</label>
            <textarea
              id="desc"
              name="desc"
              value={editedProduct.desc}
              onChange={handleInputChange}
              placeholder="Enter Product Description"
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={editedProduct.price}
              onChange={handleInputChange}
              placeholder="Enter Price"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Image:</label>
            <div className="image-preview">
              <img src={editedProduct.img} alt={editedProduct.name} />
            </div>
            <input
              type="file"
              id="img"
              name="img"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          
          <div className="form-group">
            <label>Categories:</label>
            <div className="categories-display">
              {editedProduct.categories && editedProduct.categories.length 
                ? editedProduct.categories.map(c => c.name).join(", ") 
                : "No Category"}
            </div>
          </div>
          
          <div className="edit-buttons">
            <button 
              className="save-button" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button 
              className="cancel-button" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              className="delete-button" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <>
          <img src={img} alt={name} />
          <h4>{name}</h4>
          <p>{desc}</p>
          <div className="price">${price.toLocaleString()}</div>
          <div className="categories">
            {categories && categories.length ? categories.map(c => c.name).join(", ") : "No Category"}
          </div>
          <div className="card-actions">
            <button className="edit-button" onClick={handleEdit}>Edit</button>
            <div className="status-dropdown-container">
              <button className="status-button" onClick={toggleStatusDropdown}>
                Status: {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
              {isStatusDropdownOpen && (
                <div className="status-dropdown">
                  <div 
                    className={`status-option ${status === "available" ? "active" : ""}`}
                    onClick={() => handleStatusChange("available")}
                  >
                    Available
                  </div>
                  <div 
                    className={`status-option ${status === "pending" ? "active" : ""}`}
                    onClick={() => handleStatusChange("pending")}
                  >
                    Pending
                  </div>
                  <div 
                    className={`status-option ${status === "sold" ? "active" : ""}`}
                    onClick={() => handleStatusChange("sold")}
                  >
                    Sold
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Custom Service Card component without Add to Cart and View More buttons
const ListingServiceCard = ({ serviceId, name, desc, price, img, categories, onServiceUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedService, setEditedService] = useState({
    name,
    desc,
    price,
    img,
    categories
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedService({
      name,
      desc,
      price,
      img,
      categories
    });
    setError(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the token from sessionStorage
      const accountInfo = sessionStorage.getItem("token");
      if (!accountInfo) {
        setError("Authentication token not found. Please log in again.");
        setIsLoading(false);
        return;
      }

      const parsedInfo = JSON.parse(accountInfo);
      const token = parsedInfo.token;
      
      // Create form data for the update
      const formData = new FormData();
      formData.append('name', editedService.name);
      formData.append('desc', editedService.desc);
      formData.append('price', editedService.price);
      
      // If there's a new image file, append it
      if (editedService.newImage) {
        formData.append('image', editedService.newImage);
      }
      
      // Make the API call to update the service
      const response = await fetch(`http://localhost:3001/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Failed to update service');
      }
      
      // Get the updated service data
      const updatedService = await response.json();
      
      // Show success alert
      alert("Service updated successfully!");
      
      // Exit edit mode
      setIsEditing(false);
      
      // Call the parent component's callback to refresh the service list
      if (onServiceUpdated) {
        onServiceUpdated(updatedService);
      }
      
    } catch (err) {
      console.error("Error updating service:", err);
      setError(err.message || "Failed to update service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the token from sessionStorage
      const accountInfo = sessionStorage.getItem("token");
      if (!accountInfo) {
        setError("Authentication token not found. Please log in again.");
        setIsLoading(false);
        return;
      }

      const parsedInfo = JSON.parse(accountInfo);
      const token = parsedInfo.token;
      
      // Make the API call to delete the service
      const response = await fetch(`http://localhost:3001/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Failed to delete service');
      }
      
      // Show success alert
      alert("Service deleted successfully!");
      
      // Refresh the page to update the service list
      window.location.reload();
      
    } catch (err) {
      console.error("Error deleting service:", err);
      setError(err.message || "Failed to delete service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedService(prev => ({
        ...prev,
        newImage: file
      }));
    }
  };

  return (
    <div className="listing-card">
      {isEditing ? (
        <div className="edit-mode">
          <h3>Edit Service</h3>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedService.name}
              onChange={handleInputChange}
              placeholder="Enter Service Name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="desc">Description:</label>
            <textarea
              id="desc"
              name="desc"
              value={editedService.desc}
              onChange={handleInputChange}
              placeholder="Enter Service Description"
              rows="4"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={editedService.price}
              onChange={handleInputChange}
              placeholder="Enter Price"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Image:</label>
            <div className="image-preview">
              <img src={editedService.img} alt={editedService.name} />
            </div>
            <input
              type="file"
              id="img"
              name="img"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          
          <div className="form-group">
            <label>Categories:</label>
            <div className="categories-display">
              {editedService.categories && editedService.categories.length 
                ? editedService.categories.map(c => c.name).join(", ") 
                : "No Category"}
            </div>
          </div>
          
          <div className="edit-buttons">
            <button 
              className="save-button" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button 
              className="cancel-button" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              className="delete-button" 
              onClick={handleDelete}
              disabled={isLoading}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <>
          <img src={img} alt={name} />
          <h4>{name}</h4>
          <p>{desc}</p>
          <div className="price">${price.toLocaleString()}</div>
          <div className="categories">
            {categories && categories.length ? categories.map(c => c.name).join(", ") : "No Category"}
          </div>
          <div className="card-actions">
            <button className="edit-button" onClick={handleEdit}>Edit</button>
          </div>
        </>
      )}
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

    const handleProductUpdated = (updatedProduct) => {
        // Update the products list with the updated product
        setProducts(prevProducts => 
            prevProducts.map(product => 
                product.productId === updatedProduct.productId ? updatedProduct : product
            )
        );
    };

    const handleServiceUpdated = (updatedService) => {
        // Update the services list with the updated service
        setServices(prevServices => 
            prevServices.map(service => 
                service.serviceId === updatedService.serviceId ? updatedService : service
            )
        );
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

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
                    </div>
                    <div className="listing-content">
                        {subView === "all_products" && (
                            <div className="products-content">
                                {products.length > 0 ? (
                                    products.map((item) => (
                                        <ListingProductCard 
                                            key={item.productId} 
                                            {...item} 
                                            status={item.status || "unavailable"}
                                            onProductUpdated={handleProductUpdated}
                                        />
                                    ))
                                ) : (
                                    <p>You have no products listed.</p>
                                )}
                            </div>
                        )}
                        {subView === "orders" && (<ul><li>Order 1</li><li>Order 2</li></ul>)}
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
                                        <ListingServiceCard 
                                            key={item.serviceId} 
                                            {...item} 
                                            onServiceUpdated={handleServiceUpdated}
                                        />
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