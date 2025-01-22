import React, { useState } from "react";
import logo from "../../assets/uc-MP-logo.png";
import { Link } from "react-router-dom";
import BookingCalendar from "./BookingCalender";
import "./Services.css";

const ServicesCard = (props) => {
  const { serviceId, name, desc, rating, price, img } = props;
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Handler to close the calendar
  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
  };

  return (
    <div className="services">
      <figure>
        <img src={img} key={props.img} alt="item-img"></img>
      </figure>
      <strong className="rating">{rating}</strong>
      <h4 className="title">{name}</h4>
      <p>{desc}</p>
      <h3 className="price">$ {price.toLocaleString()}</h3>
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
