import React, { useState } from "react";
import logo from "../../assets/uc-MP-logo.png";
import { Link } from "react-router-dom";
import BookingCalendar from "./BookingCalender";
import "./Services.css";

const ServicesCard = (props) => {
  const { id, rating, title, price } = props;
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  
  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
  };

  return (
    <div className="services">
      <figure>
        <img src={logo} alt="item-img" />
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
          <BookingCalendar onClose={handleCloseCalendar} />
        </div>
      )}
    </div>
  );
};

export default ServicesCard;
