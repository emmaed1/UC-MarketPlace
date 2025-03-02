import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import cartContext from "../../components/ShoppingCart/Context/CartContext";
import './products.css'

const ProductsCard = (props) => {
  const { productId, desc, name, price, img, categories } = props;
  const { addItem } = useContext(cartContext);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
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
