import React from "react";
import logo from "../../assets/uc-MP-logo.png";
import { Link } from 'react-router-dom';

import "./Services.css";

const ServicesCard = (props) => {
  const { id, rating, title, price } = props;
  return (
    <div className="services">
      <figure>
        <img src={logo} alt="item-img" />
      </figure>
      <strong className="rating">{rating}</strong>
      <h4 className="title">{title}</h4>
      <h3 className="price">$ {price.toLocaleString()}</h3>
      {/* TODO: MAKE THIS BUTTON GO TO CALENDAR BOOKING */}
      <button
        type="button"
        >Book Service</button>
      <Link className='details' to={`/services/${id}`}>View More</Link>
    </div>
  );
};

export default ServicesCard;
