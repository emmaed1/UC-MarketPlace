import { useParams, Link } from 'react-router-dom';
import "./products.css";
import logo from '../../assets/uc-MP-logo.png';

export default function ProductDetails() {
    const { id } = useParams();

    // Sample data; replace with actual data fetching logic if available
    const productData = {
        1: { name: "Product 1", description: "Description for Product 1", price: "$10" },
        2: { name: "Product 2", description: "Description for Product 2", price: "$20" },
        3: { name: "Product 3", description: "Description for Product 3", price: "$30" },
        // Add other product details as needed
    };

    const product = productData[id];

    return (
        <div>
            <div className="product-details">
                <div className="product-image">
                    <img 
                        src={logo} 
                        alt={product ? `${product.name} Image` : "Product Image Not Available"} 
                    />
                </div>
                <div className="product-description">
                    {product ? (
                        <>
                            <h2 className="product-title">{product.name}</h2>
                            <p>{product.description}</p>
                            <p className="product-price">Price: {product.price}</p>
                            <Link to= "/cart" className='cart-button'>Add to Cart</Link>
                        <div>
                            <div class="seller-info">
                                <img src="path_to_seller_profile_image.jpg" alt="Seller Profile Image" class="seller-profile-img"/>
                                <div class="seller-details">
                                <a href="/account-view" class="seller-name">Seller Name</a> 
                                <p class="seller-description">Specializing in [product type or category the seller specializes in]</p>
                                </div>
                            </div>
                        </div>
                        <Link to="/products" className="product-button">Back to Products</Link> 
                        </> /*Link to seller will link to the buyer's view of the account page where the edit/add productbutons are unavailble. It should just show the seller's profile */
                    ) : (
                        <p>Product not found</p>
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
}
