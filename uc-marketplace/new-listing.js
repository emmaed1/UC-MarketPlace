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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [img, setImage] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name, desc, price, quantity, img };
    const postType = document.getElementById("listing-type").value;
    const selectedCategoryIds = selectedCategories.map(Number);

    try {
      fetch(`http://localhost:3001/${postType}s`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          desc: data.desc,
          price: parseFloat(data.price),
          quantity: parseInt(data.quantity),
          rating: 0,
          img: "images/" + data.img,
          categoryIds: selectedCategoryIds,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));

      Swal.fire({
        title: "Success!",
        text: "Your listing was successfully posted!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error: ", error);
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
              value={img} // Fixed: Use img state
              onChange={(e) => setImage(e.target.files[0])} // Get the file object
              accept="image/*"
              multiple
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
