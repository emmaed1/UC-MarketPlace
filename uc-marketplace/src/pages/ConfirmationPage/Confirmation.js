import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Confirmation.css";

const Confirmation = () => {
  const location = useLocation(); // To access the passed state (cart data and total)
  const navigate = useNavigate();

  const { cartItems, cartTotal } = location.state || { cartItems: [], cartTotal: 0 }; // Fallback if state is empty

  const handleReturnToShop = () => {
    // Navigate back to the main shop or home page
    navigate("/");
  };

  return (
    <div className="confirmation-page">
      <h1>Thank You for Your Order!</h1>

      <p>Your order has been successfully placed. Below are your order details:</p>

      {/* Order Summary */}
      <div className="order-summary">
        <h2>Order Summary</h2>
        {cartItems.map((item, index) => (
          <div className="order-item" key={index}>
            <h4>{item.title}</h4>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Subtotal: ${item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      {/* Total Price */}
      <h3>Total Price: $100.00</h3>

      <p>If you have any questions, feel free to contact us at UCMarketPlace@example.com</p>

      {/* Return to Shop Button */}
      <button onClick={handleReturnToShop} className="return-button">
        Return to Shop
      </button>
    </div>
  );
};

export default Confirmation;
