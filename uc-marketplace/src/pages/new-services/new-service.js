import "./new-service.css"; // Ensure this CSS matches your needs
import logo from '../../assets/uc-MP-logo.png';

export default function NewService() {
  return (
    <div className="content">
      <div className="welcome-content">
        <img src={logo} alt='uc marketplace-logo' />
        <div className="welcome-text">
          <h1>Create a New Service</h1>
        </div>
      </div>

      <div className="listing-form-container">
        <h2>Service Details</h2>
        <form className="listing-form">
          <div className="form-group">
            <label htmlFor="listing-type">Type:</label>
            <select id="listing-type" name="listingType">
              <option value="service">Service</option>
              <option value="product">Product</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Service Name:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="Enter Service Name:" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea 
              id="description" 
              name="description" 
              placeholder="Enter Service Description:" 
              rows="5" 
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input 
              type="number" 
              id="price" 
              name="price" 
              placeholder="Enter Price:" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="photos">Upload Photos:</label>
            <input 
              type="file" 
              id="photos" 
              name="photos" 
              accept="image/*" 
              multiple 
            />
          </div>

          <button type="submit" className="post-button">Post Service</button>
        </form>
      </div>
    </div>
  );
}
