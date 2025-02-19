import React, { useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import cartContext from "../../components/ShoppingCart/Context/CartContext";
import './products.css'

const ProductsCard = (props) => {
  const { productId, desc, name, price, img, categories } = props;
  const { addItem } = useContext(cartContext);
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Debug log for image URL
  useEffect(() => {
    console.log(`Product ${name} image URL:`, img);
  }, [img, name]);

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
        {img ? (
          <img 
            src={img.startsWith('http') ? img : `http://localhost:3001${img}`}
            alt={name}
            onError={(e) => {
              console.error(`Failed to load image for ${name}:`, img);
              setImageError(true);
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = '/assets/placeholder.png';
            }}
          />
        ) : (
          <div className="no-image">No Image Available</div>
        )}
      </figure>
      <h4 className="product-title">{name}</h4>
      <p>{desc}</p>
      <h3 className="price">$ {price?.toLocaleString() || '0'}</h3>
      <p className="product-categories">
        {categories && categories.length > 0 
          ? categories.map(cat => cat.name).join(", ")
          : "No Category"}
      </p>

      <button
        type="button"
        className={`btn ${isAdded ? "added" : ""}`}
        onClick={handleAddToCart}
      >
        {isAdded ? "Added" : "Add to cart"}
      </button>
      <Link className="details" to={`/products/${productId}`}>
        View More
      </Link>
    </div>
  );
};

export default ProductsCard;
