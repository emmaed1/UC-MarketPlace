import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import cartContext from "../../components/ShoppingCart/Context/CartContext";
import './products.css'

const ProductsCard = (props) => {
  const { productId, desc, name, price, img, categories } = props;
  const { addItem } = useContext(cartContext);
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    const item = { ...props };
    addItem(item);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
  };

  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Get full image URL
  const getImageUrl = (imgPath) => {
    if (!imgPath) return '/placeholder-image.png'; // Add a placeholder image
    if (imgPath.startsWith('http')) return imgPath;
    return `http://localhost:3001${imgPath}`;
  };

  return (
    <div className="products">
      <figure>
        <img 
          src={imageError ? '/placeholder-image.png' : getImageUrl(img)}
          alt={name}
          onError={handleImageError}
        />
      </figure>
      <h4 className="product-title">{name}</h4>
      <p>{desc}</p>
      <h3 className="price">$ {price.toLocaleString()}</h3>
      <p className="categories">
        {categories && categories.length > 0 
          ? categories.map(c => c.name).join(", ") 
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