import "./new-listing.css";
import logo from "../../assets/uc-MP-logo.png";
import Swal from "sweetalert2";
import { useState } from "react";

const NewListing = () => {
  const [type, setType] = useState("product");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const productCategories = [
    { id: 2, name: "Academic Materials" },
    { id: 3, name: "Home Essentials" },
    { id: 4, name: "Clothing" },
    { id: 5, name: "Accesories" },
    { id: 6, name: "Technology & Electronics" },
    { id: 7, name: "Food & Beverage" },
    { id: 8, name: "Entertainment" },
    { id: 9, name: "Collectibles" },
    { id: 10, name: "Miscellaneous" },
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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        e.target.value = '';
        Swal.fire({
          title: "Error!",
          text: "File size too large. Please choose an image under 5MB.",
          icon: "error",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        e.target.value = '';
        Swal.fire({
          title: "Error!",
          text: "Please select an image file.",
          icon: "error",
        });
        return;
      }

      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('price', price);
      formData.append('quantity', quantity);
      formData.append('rating', 5);
      formData.append('categoryIds', JSON.stringify(selectedCategories.map(Number)));
      if (image) {
        formData.append('image', image);
      }

      console.log("Submitting:", {
        type,
        name,
        desc,
        price,
        quantity,
        hasImage: !!image,
        categories: selectedCategories
      });

      const response = await fetch(`http://localhost:3001/${type}s`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create listing');
      }

      console.log("Success", data);

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
      setSelectedCategories([]);
      document.getElementById('photos').value = '';

    } catch (error) {
      console.error("Error: ", error);
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
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
        <form className="listing-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="listing-type">Type:</label>
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
            />
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