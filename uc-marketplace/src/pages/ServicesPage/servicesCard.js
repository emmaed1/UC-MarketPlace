import React, { useState } from "react";
import { Link } from "react-router-dom";
import BookingCalendar from "./BookingCalender";
import "./Services.css";

const ServicesCard = (props) => {
  const { id, img, rating, title, price } = props; // Add `img` to the props destructuring
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Handler to close the calendar
  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
  };

  return (
    <div className="services">
      <figure>
        {/* Use dynamic img property */}
        <img src={img} alt={title} className="service-image" />
      </figure>
      <strong className="rating">{rating}</strong>
      <h4 className="title">{title}</h4>
      <h3 className="price">$ {price.toLocaleString()}</h3>
      <button
        type="button"
        className="service-button"
        onClick={() => setIsCalendarOpen(true)}
      >
        Book Service
      </button>
      <Link className="details" to={`/services/${id}`}>
        View More
      </Link>

      {isCalendarOpen && (
        <div className="calendar-modal">
          {/* Pass handleCloseCalendar as onClose prop */}
          <BookingCalendar onClose={handleCloseCalendar} />
        </div>
      )}
    </div>
  );
};

export default ServicesCard;
