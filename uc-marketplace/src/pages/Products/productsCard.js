import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import cartContext from "../../components/ShoppingCart/Context/CartContext";
import './products.css'

const ProductsCard = (props) => {
  const { productId, rating, name, price, img } = props;
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
    <div className="products">
      <figure>
        <img src={img} key={props.img} alt="item-img" ></img>
      </figure>
      <strong className="rating">{rating}</strong>
      <h4 className="title">{name}</h4>
      <h3 className="price">$ {price.toLocaleString()}</h3>
      <button
        type="button"
        className={`btn ${isAdded ? "added" : ""}`}
        onClick={handleAddToCart}
      >
        {isAdded ? "Added" : "Add to cart"}
      </button>
      <Link className='details' to={`/products/${productId}`}>View More</Link>
    </div>
  );
};

export default ProductsCard;