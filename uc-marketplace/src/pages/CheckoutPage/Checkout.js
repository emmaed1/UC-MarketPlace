import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const location = useLocation(); // Access passed state (cart data)
  const navigate = useNavigate();

  const { cartItems, cartTotal } = location.state || { cartItems: [], cartTotal: 0 }; // Fallback if state is empty

  const handleSubmitOrder = () => {
    console.log("Order submitted!");
    navigate("/confirmation"); // Navigate to confirmation page
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      {/* Cart Items */}
      <div className="cart-section">
        <h2>Your Cart</h2>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <div className="item-details">
                <h4 className="item-title">{item.title}</h4>
                <p className="item-price">Price: ${item.price.toFixed(2)}</p>
                <p className="item-quantity">Quantity: {item.quantity}</p>
                <p className="item-subtotal">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-cart">Your cart is empty.</p>
        )}
      </div>

      {/* Total Price */}
      <div className="total-section">
        <h3>Total Price:</h3>
        <p className="cart-total">${cartTotal.toFixed(2)}</p>
      </div>

      {/* Delivery Method */}
      <div className="delivery-section">
        <h3>Delivery Method</h3>
        <label>
          <input type="radio" name="delivery-method" value="delivery" defaultChecked />
          Delivery
        </label>
        <label>
          <input type="radio" name="delivery-method" value="meetup" />
          Meetup
        </label>
      </div>

      {/* Payment Method */}
      <div className="payment-section">
        <h3>Payment Method</h3>
        <select className="payment-dropdown">
          <option value="paypal">PayPal</option>
          <option value="credit-card">Credit Card</option>
          <option value="cash">Cash</option>
        </select>
      </div>

      {/* Message to Seller */}
      <div className="message-section">
        <label htmlFor="message" className="message-label">
          Message to Seller
        </label>
        <textarea
          id="message"
          rows="4"
          placeholder="Type your message here"
          className="message-textarea"
        ></textarea>
      </div>

      {/* Submit Button */}
      <button className="submit-button" onClick={handleSubmitOrder}>
        Submit Order
      </button>
    </div>
  );
};

export default Checkout;
