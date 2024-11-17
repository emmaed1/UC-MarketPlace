import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const location = useLocation(); // Access passed state
  const navigate = useNavigate();

  const { cartItems, cartTotal } = location.state || { cartItems: [], cartTotal: 0 }; // Fallback for empty state

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [paypalEmail, setPaypalEmail] = useState("");

  const handleDeliveryChange = (event) => {
    setDeliveryMethod(event.target.value);
  };

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePaypalEmailChange = (event) => {
    setPaypalEmail(event.target.value);
  };

  const handleSubmitOrder = () => {
    console.log("Order submitted with:");
    console.log(`Delivery Method: ${deliveryMethod}`);
    console.log(`Payment Method: ${paymentMethod}`);
    if (paymentMethod === "paypal") {
      console.log(`PayPal Email: ${paypalEmail}`);
    }
    navigate("/confirmation");
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

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

      <div className="total-section">
        <h3>Total Price:</h3>
        <p className="cart-total">${cartTotal.toFixed(2)}</p>
      </div>

      <div className="delivery-section">
        <h3>Delivery Method</h3>
        <label>
          <input
            type="radio"
            name="delivery-method"
            value="delivery"
            checked={deliveryMethod === "delivery"}
            onChange={handleDeliveryChange}
          />
          Delivery
        </label>
        <label>
          <input
            type="radio"
            name="delivery-method"
            value="meetup"
            checked={deliveryMethod === "meetup"}
            onChange={handleDeliveryChange}
          />
          Meetup
        </label>
      </div>

      {deliveryMethod === "delivery" && (
        <div className="delivery-info">
          <h4>Delivery Address</h4>
          <input
            type="text"
            placeholder="Enter your address"
            className="delivery-address-input"
          />
        </div>
      )}
      {deliveryMethod === "meetup" && (
        <div className="meetup-info">
          <h4>Meetup Location</h4>
          <p>Please choose a meetup location in your message to the seller.</p>
        </div>
      )}

      <div className="payment-section">
        <h3>Payment Method</h3>
        <select
          className="payment-dropdown"
          value={paymentMethod}
          onChange={handlePaymentChange}
        >
          <option value="paypal">PayPal</option>
          <option value="credit-card">Credit Card</option>
          <option value="cash">Cash</option>
        </select>
      </div>

      {paymentMethod === "paypal" && (
        <div className="paypal-info">
          <h4>PayPal Email</h4>
          <input
            type="email"
            placeholder="Enter your PayPal email"
            value={paypalEmail}
            onChange={handlePaypalEmailChange}
            className="paypal-email-input"
          />
        </div>
      )}
      {paymentMethod === "credit-card" && (
        <div className="credit-card-info">
          <h4>Credit Card Details</h4>
          <input type="text" placeholder="Card Number" />
          <input type="text" placeholder="Expiry Date (MM/YY)" />
          <input type="text" placeholder="CVV" />
        </div>
      )}
      {paymentMethod === "cash" && <p>Cash will be collected upon delivery or meetup.</p>}

      <div className="message-section">
        <label htmlFor="message" className="message-label">
          Message to Seller
        </label>
        <textarea id="message" rows="4" placeholder="Type your message here"></textarea>
      </div>

      <button className="submit-button" onClick={handleSubmitOrder}>
        Submit Order
      </button>
    </div>
  );
};

export default Checkout;
