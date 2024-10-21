import "./products.css";
import logo from '../../assets/uc-MP-logo.png';

export default function Products() {
    return (
        <div>
            {/* Content Section */}
            <div className="content">
                <div className="welcome-content">
                    <div className="welcome-text">
                        <h1>Products</h1>
                    </div>
                </div>
            </div>
            
            {/* Product Listing Section */}
            <div className="container">
            <div className="search-bar">
                <input type="text" id="search" placeholder="Search for products..." /> 
            </div>
                <div className="products">
                    <ul className="product-items">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(id => (
                            <li key={id}>
                                <div className="imgresize">
                                    <img src={logo} alt={`Listing ${id} Image`} />
                                </div>
                                <a href={`/listing/${id}`}>Listing {id}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="features-container">
                <div className="featured-section">
                <h3 className="featured-title">Special Offers</h3>
                <a href="/special-offers">View Offers</a>
                </div>

                <div className="featured-section">
                <h3 className="featured-title">Top Services</h3>
                <a href="/top-services">Explore Now</a>
                </div>

                <div className="featured-section">
                <h3 className="featured-title">New Arrivals</h3>
                <a href="/new-arrivals">See What's New</a>
                </div>
            </div>
            
            <div className="faq-section">
                <h2>Frequently Asked Questions</h2>
                <p>Find answers to common questions about our services.</p>
            </div>
        </div>
    );
}
