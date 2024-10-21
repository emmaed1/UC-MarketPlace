import "./products.css";
import logo from '../../assets/uc-MP-logo.png';
import { useState } from 'react';

export default function Products() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const products = [
        { id: 1, name: 'Product 1', details: 'Details about Product 1', sellerLink: 'https://example.com/seller1' },
        { id: 2, name: 'Product 2', details: 'Details about Product 2', sellerLink: 'https://example.com/seller2' },
        { id: 3, name: 'Product 3', details: 'Details about Product 3', sellerLink: 'https://example.com/seller3' }
    ];

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

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
                        {products.map(product => (
                            <li key={product.id}>
                                <div className="imgresize">
                                    <img src={logo} alt={`Listing ${product.id} Image`} />
                                </div>
                                <a href="#" onClick={() => handleProductClick(product)}>{product.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Modal for Product Details */}
            {isModalOpen && selectedProduct && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedProduct.name}</h2>
                        <p>{selectedProduct.details}</p>
                        <a href={selectedProduct.sellerLink} target="_blank" rel="noopener noreferrer">Visit Seller</a>
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
