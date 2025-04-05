import React, { useState } from "react";
import { Link } from "react-router-dom";
import BookingCalendar from "./BookingCalender"; 
import "./Services.css";

const ServicesCard = (props) => {
  const { serviceId, name, desc, rating, price, img, categories } = props;
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  
  const serviceAvailability = [
    { day: "Monday", time: "9:00 AM" },
    { day: "Monday", time: "10:00 AM" },
    { day: "Wednesday", time: "1:00 PM" },
    { day: "Friday", time: "3:00 PM" },
  ];

  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
  };

  const handleBookingConfirm = (bookingDetails) => {
    console.log("Booking confirmed:", bookingDetails);
    // Handle booking confirmation
  };

  return (
    <div className="services">
      <figure>
        <img src={img} alt="item-img" />
      </figure>
      <strong className="rating">{rating}</strong>
      <h4 className="title">{name}</h4>
      <p>{desc}</p>
      <h3 className="price">$ {price.toLocaleString()}</h3>
      <p>{categories && categories.length ? categories.map(c => c.name).join(", ") : "No Category"}</p>

      <div className="button-group">
        <button
          type="button"
          className="service-button"
          onClick={() => setIsCalendarOpen(true)}
        >
          Book Service
        </button>
        <Link className="details" to={`/services/${serviceId}`}>
          View More
        </Link>
      </div>

      {isCalendarOpen && (
        <div className="calendar-modal">
          <div className="calendar-modal-content">
            <button className="close-button" onClick={handleCloseCalendar}>×</button>
            <BookingCalendar 
              onClose={handleCloseCalendar} 
              onBookingConfirm={handleBookingConfirm}
              serviceAvailability={serviceAvailability} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesCard;