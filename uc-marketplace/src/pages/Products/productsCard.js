import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import cartContext from "../../components/ShoppingCart/Context/CartContext";
import './products.css'

const ProductsCard = (props) => {
  const { productId, desc, name, price, img, categories, status } = props;
  const { addItem } = useContext(cartContext);
  const [isAdded, setIsAdded] = useState(false);

  const getStatusDisplay = () => {
    switch (status) {
      case 'available':
        return { text: 'Available', class: 'status-available' };
      case 'pending':
        return { text: 'Pending', class: 'status-pending' };
      case 'sold':
        return { text: 'Sold', class: 'status-sold' };
      case 'unavailable':
        return { text: 'Unavailable', class: 'status-unavailable' };
      default:
        return { text: 'Unknown', class: 'status-unavailable' };
    }
  };

  const handleAddToCart = () => {
    if (status !== 'available') {
      return;
    }

    const item = {
      id: productId,
      name: name,
      price: price,
      img: img,
      quantity: 1,
      desc: desc,
      categories: categories
    };

    console.log('Adding item to cart:', item);
    addItem(item);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="products">
      <figure>
        <img src={img} alt="item-img" />
      </figure>
      <h4 className="product-title">{name}</h4>
      <p>{desc}</p>
      <h3 className="price">$ {price.toLocaleString()}</h3>
      <p>{categories && categories.length ? categories.map(c => c.name).join(", ") : "No Category"}</p>

      <button
        type="button"
        className={`btn ${isAdded ? "added" : ""}`}
        onClick={handleAddToCart}
        disabled={status !== 'available'}
      >
        {isAdded ? "Added" : status === 'available' ? "Add to cart" : statusInfo.text}
      </button>
      <Link className="details" to={`/products/${productId}`}>
        View More
      </Link>
    </div>
  );
};

export default ProductsCard;
