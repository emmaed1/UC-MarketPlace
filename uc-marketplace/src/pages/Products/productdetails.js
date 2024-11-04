import { useParams, Link } from "react-router-dom";
import "./products.css";
import logo from "../../assets/uc-MP-logo.png";
import productsData from "./productsData";

const ProductDetails = () => {
  const { id } = useParams();
  const productData = productsData;
  const product = productData[id];

  return (
    <div>
      <div className="product-details">
        <div className="product-image">
          <img
            src={logo}
            alt={
              product ? `${product.title} Image` : "Product Image Not Available"
            }
          />
        </div>
        <div className="product-description">
          {product ? (
            <>
              <h2 className="product-title">{product.title}</h2>
              <p>{product.description}</p>
              <p className="product-price">Price: {product.price}</p>
              <div>
                <div className="provider-info">
                  <img
                    src="path_to_provider_profile_image.jpg"
                    alt="Provider Profile Image"
                    className="provider-profile-img"
                  />
                  <div className="provider-details">
                    <a href="/account-view" className="provider-name">
                      Provider Name
                    </a>
                    <p className="provider-description">
                      Specializing in [service type or category the provider
                      specializes in]
                    </p>
                  </div>
                </div>
              </div>
                <Link to="/message-seller" className="message-button">Message the Seller</Link>
                            
                <Link to="/services" className="service-button">Back to Products</Link>
            </> /*Link to seller will link to the buyer's view of the account page where the edit/add productbutons are unavailble. It should just show the seller's profile */
          ) : (
            <div>
                <Link to="/services" className="service-button">Back to Products</Link>
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
