import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import "./products.css";
import cartContext from "../../components/ShoppingCart/Context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addItem } = useContext(cartContext);
  const [product, setProduct] = useState(null); // Initialize as null
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (product) {
      const item = {
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: 1,
        desc: product.desc,
        categories: product.categories,
      };
      addItem(item);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 3000);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:3001/products/${id}`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => {
        console.error("Error getting product", err);
        setProduct(null); // Set product to null on error
      });
  }, [id]);

  return (
    <div>
      <div className="product-details">
        <div className="product-image">
          {product && (
            <img
              src={product.img}
              alt={product.name ? `${product.name} Image` : "Product Image"}
            />
          )}
        </div>
        <div className="product-description">
          {product ? (
            <>
              <h2 className="product-title">{product.name}</h2>
              <p>{product.desc}</p>
              <p className="product-categories">
                {product.categories && product.categories.length
                  ? product.categories.map((c) => c.name).join(", ")
                  : "No Category"}
              </p>
              <p className="product-price">Price: ${product.price}</p>
              <button
                type="button"
                className={`cart-button ${isAdded ? "added" : ""}`}
                onClick={handleAddToCart}
              >
                {isAdded ? "Added" : "Add to cart"}
              </button>
              <div>
                <div className="provider-info">
                  <div className="provider-details">
                    <p className="provider-name">
                      Seller: {product.user?.name || "Seller Name Not Available"}
                    </p>
                  </div>
                </div>
              </div>
              <Link to={{pathname: "/account-view", search: `?sellerName=${product.user?.name || ""}`,}}className="message-button">
                Message the Seller
              </Link>
              <Link to="/products" className="product-button">
                Back to Products
              </Link>
            </>
          ) : (
            <div>
              <Link to="/products" className="product-button">
                Back to Products
              </Link>
              <p>Product not found</p>
            </div>
          )}
        </div>
      </div>

      <div className="reviews">
        <h2>Seller Reviews</h2>
        <p>See what other students say about this seller:</p>
        <div className="review-cards">
          <table>
            <thead>
              <tr className="review-header">
                <th>Student 1</th>
                <th>Student 2</th>
                <th>Student 3</th>
              </tr>
            </thead>
            <tbody>
              <tr className="review-content">
                <td>great!</td>
                <td>awesome!</td>
                <td>cool!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;