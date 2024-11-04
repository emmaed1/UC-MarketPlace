import React, { useContext, useState } from "react";
import logo from "../../assets/uc-MP-logo.png";
import { Link } from 'react-router-dom';
import cartContext from "../../components/ShoppingCart/Context/CartContext";
import "./Services.css";

const ServicesCard = (props) => {
  const { id, rating, title, price } = props;
  const { addItem } = useContext(cartContext);
  const [isAdded, setIsAdded] = useState(false);
  const handleAddToCart = () => {
    const item = { ...props };
    addItem(item);

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
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
        className={`btn ${isAdded ? "added" : ""}`}
        onClick={handleAddToCart}
      >
        {isAdded ? "Added" : "Add to cart"}
      </button>
      <Link className='details' to={`/services/${id}`}>View More</Link>
    </div>
  );
};

export default ServicesCard;
