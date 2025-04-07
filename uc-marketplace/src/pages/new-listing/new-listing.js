import "./new-listing.css";
import logo from "../../assets/uc-MP-logo.png";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import axios from "axios";
import BookingCalendar from "../ServicesPage/BookingCalender";
import CalendarAvailabilitySelector from "../ServicesPage/CalendarAvailabilitySelector"



const NewListing = () => {
  const [type, setType] = useState("product");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [img, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [userId, SetUserId] = useState();
  const [availability, setAvailability] = useState([]);
  const [showCalendarPreview, setShowCalendarPreview] = useState(false);

  useEffect(() => {
    const accountInfo = sessionStorage.getItem("token");
    if (accountInfo) {
      const parsedInfo = JSON.parse(accountInfo);
      const userId = parsedInfo.id;
      console.log(userId);
      SetUserId(userId);
    }
  }, []);

  const productCategories = [
    { id: 1, name: "Academic Materials" },
    { id: 2, name: "Home Essentials" },
    { id: 3, name: "Clothing" },
    { id: 4, name: "Accesories" },
    { id: 5, name: "Technology and Electronics" },
    { id: 6, name: "Food and Beverage" },
    { id: 7, name: "Entertainment" },
    { id: 8, name: "Collectibles" },
    { id: 9, name: "Miscellaneous" },
  ];

  const serviceCategories = [
    { id: 1, name: "Academic Help" },
    { id: 2, name: "Technology Support" },
    { id: 3, name: "Photography and Videography" },
    { id: 4, name: "Beauty and Personal Care" },
    { id: 5, name: "Automotive Services" },
    { id: 6, name: "Creative Work" },
    { id: 7, name: "Pet Services" },
    { id: 8, name: "Entertainment and Event Planning" },
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

  // Format the availability data for the BookingCalendar component
  // BookingCalendar expects data in the format with date or day properties
  const formatAvailabilityForCalendar = () => {
    return availability.map(slot => ({
      date: slot.date,    // YYYY-MM-DD format
      time: slot.time     // Time slot (9:00 AM, etc.)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 Prevent form submission if service and no availability selected
    if (type === "service" && availability.length === 0) {
      Swal.fire({
        title: "Missing Availability",
        text: "Please select your available time slots before posting your service.",
        icon: "warning",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("categoryIds", JSON.stringify(selectedCategories));
      formData.append("userId", JSON.stringify(userId));
      if (type === "service") {
        formData.append("availability", JSON.stringify(availability));
      }
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const endpoint = type === "product" ? "products" : "services";

      const response = await axios.post(`http://localhost:3001/${endpoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(`${type} created:`, response.data);
      Swal.fire({
        title: "Success!",
        text: `Your ${type} was successfully posted!`,
        icon: "success",
      });

      // Clear form
      setName("");
      setDesc("");
      setPrice(0);
      setQuantity(0);
      setSelectedCategories([]);
      setSelectedFile(null);
      setAvailability([]);
      setShowCalendarPreview(false);
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      const errorMessage = error.response?.data?.error || `Failed to create ${type}`;
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  const toggleCalendarPreview = () => {
    setShowCalendarPreview(!showCalendarPreview);
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

          {type === "service" && (
            <>
              <div className="form-group">
                <label>Set Your Availability:</label>
                <p className="availability-instruction">
                  Click on dates in the calendar and select available time slots.
                </p>
                <CalendarAvailabilitySelector 
                  availability={availability}
                  setAvailability={setAvailability}
                />
              </div>
              
              {availability.length > 0 && (
                <div className="form-group calendar-preview-section">
                  <button 
                    type="button" 
                    className="preview-calendar-button"
                    onClick={toggleCalendarPreview}
                  >
                    {showCalendarPreview ? "Hide Customer View" : "Preview Customer View"}
                  </button>
                  
                  {showCalendarPreview && (
                    <div className="calendar-preview">
                      <h3>Customer Booking View</h3>
                      <p>This is how your availability will appear to customers:</p>
                      <BookingCalendar 
                        serviceAvailability={formatAvailabilityForCalendar()}
                        onBookingConfirm={() => {}}
                        onClose={() => setShowCalendarPreview(false)}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

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