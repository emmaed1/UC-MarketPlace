import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import cartContext from "../../components/ShoppingCart/Context/CartContext";
import './products.css';

const ProductsCard = (props) => {
  const { productId, desc, name, price, img, sellerId } = props;
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
        <img src={img} key={props.img} alt="item-img" />
      </figure>
      <h4 className="title">{name}</h4>
      <p>{desc}</p>
      <h3 className="price">$ {price.toLocaleString()}</h3>
      <button
        type="button"
        className={`btn ${isAdded ? "added" : ""}`}
        onClick={handleAddToCart}
      >
        {isAdded ? "Added" : "Add to cart"}
      </button>
      <Link className='details' to={`/products/${productId}`}>View More</Link>
      <button
        type="button"
        className="btn chat-btn"
        onClick={() => props.onChatClick({ productId, sellerId })}
      >
        Chat with Seller
      </button>
    </div>
  );
};

export default ProductsCard;