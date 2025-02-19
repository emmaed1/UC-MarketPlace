import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import "./products.css";
import cartContext from "../../components/ShoppingCart/Context/CartContext";

const ProductDetails = (props) => {
  const { id } = useParams();
  const { addItem } = useContext(cartContext);
  const [product, getProduct] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const handleAddToCart = () => {
    const item = { ...props };
    addItem(item);

    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 3000);
  };

  useEffect(() => {
    fetch(`http://localhost:3001/products/${id}`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => getProduct(data))
      .catch((err) => {
        console.log("Error getting products", err);
      });
  }, [id]);

  return (
    <div>
      <div className="product-details">
        <div className="product-image">
          {product.img ? (
            <img
              src={product.img}
              key={id}
              alt={product ? `${product.name} Image` : "Product Image Not Available"}
              onError={(e) => {
                console.error('Failed to load image:', product.img);
                e.target.src = '/assets/placeholder.png';
              }}
            />
          ) : (
            <div className="no-image">No Image Available</div>
          )}
        </div>
        <div className="product-description">
          {product ? (
            <>
              <h2 className="product-title">{product.name}</h2>
              <p>{product.desc}</p>
              <p  className="product-categories">
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
                <div class="seller-info">
                  <img
                    src="path_to_seller_profile_image.jpg"
                    alt="Seller Profile Image"
                    class="seller-profile-img"
                  />
                  <div class="seller-details">
                    <a href="/account-view" class="seller-name">
                      Seller Name
                    </a>
                    <p class="seller-description">
                      Specializing in [product type or category the seller
                      specializes in]
                    </p>
                  </div>
                </div>
              </div>
              <Link to="/message-seller" className="message-button">
                Message the Seller
              </Link>

              <Link to="/products" className="product-button">
                Back to Products
              </Link>
            </> /*Link to seller will link to the buyer's view of the account page where the edit/add productbutons are unavailble. It should just show the seller's profile */
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
