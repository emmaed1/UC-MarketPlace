import "./new-listing.css";
import logo from "../../assets/uc-MP-logo.png";
import Swal from "sweetalert2";
import { useState } from "react";

const NewListing = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('desc', desc);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('rating', 5);
    if (image) {
      formData.append('image', image);
    }

    try {
      console.log("Submitting form data:", {
        name,
        desc,
        price,
        quantity,
        image: image ? image.name : 'No image'
      });

      const response = await fetch("http://localhost:3001/products", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(errorText || 'Failed to create product');
      }

      const data = await response.json();
      console.log("Success response:", data);
      
      Swal.fire({
        title: "Success!",
        text: "Your listing was successfully posted!",
        icon: "success",
      });

      // Clear form
      setName("");
      setDesc("");
      setPrice(0);
      setQuantity(0);
      setImage(null);
      
      // Reset file input
      const fileInput = document.getElementById('photos');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error("Full error details:", error);
      Swal.fire({
        title: "Error!",
        text: `Failed to create listing: ${error.message}`,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", file.name, "Size:", file.size);
      setImage(file);
    }
  };

  return (
    <div className="content">
      <div className="welcome-content">
        <img src={logo} alt="uc marketplace-logo"></img>
        <div className="welcome-text">
          <h1>List Product or Service</h1>
        </div>
      </div>

      <div className="listing-form-container">
        <h2>Create a New Listing</h2>
        <form className="listing-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="listing-title">Type:</label>
            <select id="listing-type" name="listingType">
              <option value="product">Product</option>
              <option value="service">Service</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Product or Service Name:"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Enter Product or Service Description:"
              rows="5"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter Price:"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter Quantity:"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="photos">Upload Photos:</label>
            <input
              type="file"
              id="photos"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          <button type="submit" className="post-button" disabled={loading}>
            {loading ? 'Posting...' : 'Post Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewListing;