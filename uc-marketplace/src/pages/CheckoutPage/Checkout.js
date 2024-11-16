import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const location = useLocation(); // To access the passed state (cart data)
  const navigate = useNavigate();

  const { cartItems, cartTotal } = location.state || { cartItems: [], cartTotal: 0 }; // Fallback if state is empty

  const handleSubmitOrder = () => {
    // Perform order submission logic here (e.g., send data to backend)
    console.log("Order submitted!");

    // Navigate to the confirmation page
    navigate("/confirmation");
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {/* Cart Items */}
      <div className="cart-items">
        <h2>Your Cart</h2>
        {cartItems.map((item, index) => (
          <div className="cart-item" key={index}>
            <h4>{item.title}</h4>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Subtotal: ${item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      {/* Total Price */}
      <h3>Total Price: ${cartTotal}</h3>

      {/* Delivery Method */}
      <div className="delivery-method">
        <h3>Delivery Method</h3>
        <input type="radio" id="delivery" name="delivery-method" value="delivery" defaultChecked />
        <label htmlFor="delivery">Delivery</label>
        <input type="radio" id="meetup" name="delivery-method" value="meetup" />
        <label htmlFor="meetup">Meetup</label>
      </div>

      {/* Payment Method */}
      <div className="payment-method">
        <h3>Payment Method</h3>
        <select>
          <option value="paypal">PayPal</option>
          <option value="credit-card">Credit Card</option>
          <option value="cash">Cash</option>
        </select>
      </div>

      {/* Message to Seller */}
      <div className="message-seller">
        <label htmlFor="message">Message to Seller</label>
        <textarea id="message" rows="4" placeholder="Type your message here"></textarea>
      </div>

      {/* Submit Button */}
      <button onClick={handleSubmitOrder}>Submit Order</button>
    </div>
  );
};

export default Checkout;