import "./new-listing.css";
import logo from "../../assets/uc-MP-logo.png";
import Swal from "sweetalert2";
import { useState } from "react";

const NewListing = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [img, setImage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name, desc, price, quantity, img };
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
          rating: 5,
          img: data.img
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
      if (data) {
        console.log("Success", data);
        Swal.fire({
          title: "Success!",
          text: "Your listing was successfully posted!",
          icon: "success",
        });
      }
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
              value={img}
              onChange={(e) => setImage(e.target.value)}
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
