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
        </div>
    );
}
