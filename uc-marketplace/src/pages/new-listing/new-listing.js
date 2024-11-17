import "./new-listing.css";
import logo from "../../assets/uc-MP-logo.png";
import { useDeferredValue, useEffect, useState } from "react";

const NewListing = () => {
  // const data = useState({ name: '', desc: '', price: 0, quantity: 0});

  // useEffect (() => {

  // })
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name, desc, price, quantity };
    try {
      fetch("http://localhost:3001/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          desc: data.desc,
          price: parseFloat(data.price),
          quantity: parseInt(data.quantity),
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    } catch (error) {
      console.log("Error: ", error);
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
        <form className="listing-form" onSubmit={handleSubmit} method="POST">
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
            <label htmlfor="photos">Upload Photos:</label>
            <input
              type="file"
              id="photos"
              name="photos"
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
