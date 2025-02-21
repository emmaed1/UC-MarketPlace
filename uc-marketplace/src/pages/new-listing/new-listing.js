import "./new-listing.css";
import logo from "../../assets/uc-MP-logo.png";
import Swal from "sweetalert2";
import { useState } from "react";
import axios from "axios";

const NewListing = () => {
  const [type, setType] = useState("product");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [img, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const productCategories = [
    { id: 1, name: "Academic Materials" },
    { id: 2, name: "Home Essentials" },
    { id: 3, name: "Clothing" },
    { id: 4, name: "Accesories" },
    { id: 5, name: "Technology & Electronics" },
    { id: 6, name: "Food & Beverage" },
    { id: 7, name: "Entertainment" },
    { id: 8, name: "Collectibles" },
    { id: 9, name: "Miscellaneous" },
  ];

  const serviceCategories = [
    { id: 1, name: "Academic Help" },
    { id: 2, name: "Technology Support" },
    { id: 3, name: "Photography & Videography" },
    { id: 4, name: "Beauty & Personal Care" },
    { id: 5, name: "Automotive Services" },
    { id: 6, name: "Creative Work" },
    { id: 7, name: "Pet Services" },
    { id: 8, name: "Entertainment & Event Planning" },
    { id: 9, name: "Miscellaneous" },
  ];

  const categoriesToDisplay = type === "product" ? productCategories : serviceCategories;

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('price', price);
      formData.append('quantity', quantity);
      formData.append('categoryIds', JSON.stringify(selectedCategories));
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await axios.post('http://localhost:3001/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Product created:', response.data);
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
      setSelectedCategories([]);
      setSelectedFile(null);

    } catch (error) {
      console.error('Error creating product:', error);
      
      // Add this check for inappropriate content
      if (error.response?.data?.error === "Inappropriate image content detected") {
        Swal.fire({
          title: "Error!",
          text: "The uploaded image contains inappropriate content and cannot be used.",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to create listing",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="content">
      <div className="welcome-content">
        <img src={logo} alt="uc marketplace-logo" />
        <div className="welcome-text">
          <h1>List Product or Service</h1>
        </div>
      </div>

      <div className="listing-form-container">
        <h2>Create a New Listing</h2>
        <form className="listing-form" onSubmit={handleSubmit} method="POST">
          <div className="form-group">
            <label htmlFor="listing-title">Type:</label>
            <select
              id="listing-type"
              name="listingType"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <div className="category-dropdown">
              {categoriesToDisplay.map((cat) => (
                <div key={cat.id} className="category-option">
                  <input
                    type="checkbox"
                    id={`category-${cat.id}`}
                    value={cat.id}
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                  />
                  <label htmlFor={`category-${cat.id}`}>{cat.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="photos">Upload Photos:</label>
            <input
              type="file"
              id="photos"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              accept="image/*"
            />
          </div>

          <button type="submit" className="post-button">
            Post Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewListing;