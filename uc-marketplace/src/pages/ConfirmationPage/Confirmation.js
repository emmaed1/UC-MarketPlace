import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Confirmation.css";

const Confirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { cartItems, cartTotal, paymentMethod } = location.state || { 
        cartItems: [], 
        cartTotal: 0, 
        paymentMethod: null 
    };

    const handleReturnToShop = () => {
        navigate("/");
    };

    return (
        <div className="confirmation-page">
            <h1>Thank You for Your Order!</h1>
            <div className="confirmation-message">
                <p>Your order has been successfully placed and processed.</p>
                {paymentMethod && (
                    <div className="payment-info">
                        <p>Payment Method: <span className="highlight">{paymentMethod}</span></p>
                    </div>
                )}
            </div>

            <div className="order-summary">
                <h2>Order Details</h2>
                {cartItems && cartItems.length > 0 ? (
                    <>
                        {cartItems.map((item, index) => (
                            <div className="order-item" key={index}>
                                <h3 className="item-title">{item.title}</h3>
                                <div className="item-details">
                                    <p>Price: <span className="price">${item.price.toFixed(2)}</span></p>
                                    <p>Quantity: <span className="quantity">{item.quantity}</span></p>
                                    <p>Subtotal: <span className="subtotal">${(item.price * item.quantity).toFixed(2)}</span></p>
                                </div>
                            </div>
                        ))}
                        <div className="total-section">
                            <h3>Total Amount: <span className="total-price">${cartTotal.toFixed(2)}</span></h3>
                        </div>
                    </>
                ) : (
                    <p className="no-items">No items in order</p>
                )}
            </div>

            <div className="contact-info">
                <p>If you have any questions, please contact us at:</p>
                <p className="email">UCMarketPlace@example.com</p>
            </div>

            <button onClick={handleReturnToShop} className="return-button">
                Return to Shop
            </button>
        </div>
    );
};

export default Confirmation;