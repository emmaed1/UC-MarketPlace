import "./new-listing.css";
import logo from '../../assets/uc-MP-logo.png'
import { useState } from 'react'

const NewListing = () => {
  const data = useState({ name: '', desc: '', price: 0, quantity: 0});

  return (
    <div className="content">
      <div className="welcome-content">
        <img src={logo} alt='uc marketplace-logo'></img>
          <div className="welcome-text">
            <h1>List Product or Service</h1>
          </div>
      </div>

      <div className="listing-form-container">
        <h2>Create a New Listing</h2>
        <form className="listing-form">
          <div className="form-group">
            <label htmlFor="listing-title">Type:</label>
            <select id="listing-type" name="listingType">
              <option value="product">Product</option>
              <option value="service">Service</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={data.name} placeholder="Enter Product or Service Name:" required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" value={data.description} placeholder="Enter Product or Service Description:" rows="5" required></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input type="number" id="price" name="price" value={data.price} placeholder="Enter Price:" required />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" value={data.quantity} placeholder="Enter Quantity:" required />
          </div>

          <div className="form-group">
            <label htmlfor="photos">Upload Photos:</label>
            <input type="file" id="photos" name="photos" accept="image/*" multiple />
          </div>

          <button type="submit" className="post-button">Post Listing</button>
        </form>
      </div>
    </div>
  );
}
export default NewListing;