import "./products.css";
import logo from '../../assets/uc-MP-logo.png';

export default function Products() {
    return (
        <div>
            {/* Content Section */}
            <div className="content">
                <div className="welcome-content">
                    <img src={logo} alt="uc marketplace-logo" />
                    <div className="welcome-text">
                        <h1>Welcome to Your Account</h1>
                    </div>
                </div>
            </div>
            
            {/* Product Listing Section */}
            <div className="container">
            <h2 className="product-title">Products</h2>
            <div className="search-bar">
                <input type="text" id="search" placeholder="Search for products..." /> 
            </div>
                <div className="products">
                    <ul className="product-items">
                        {[1, 2, 3].map(id => (
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
        </div>
    );
}
