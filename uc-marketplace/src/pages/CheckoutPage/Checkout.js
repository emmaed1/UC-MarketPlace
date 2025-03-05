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

  document.addEventListener('DOMContentLoaded', async () => {
    const stripe = stripe('pk_test_51Qyy4aKCv8fIXaN0RXYuZGuKmD19pibpZRuFYtHeFkZmV9nCZ3o5nESKDEkZedec96SSwLrmLB19pKFtdIZPR5Ec00zB3bezLw'); // test publishable key
    const elements = stripe.elements();

    const paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');

    const editPaymentButton = document.getElementById('editPaymentButton');
    const paymentModal = document.getElementById('paymentModal');
    const closeButton = document.querySelector('.close');
    const submitPaymentButton = document.getElementById('submitPayment');
    const submitOrderButton = document.getElementById('submitOrderButton');

    // Modal Logic
    editPaymentButton.addEventListener('click', () => {
        paymentModal.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
    });

    // Payment Submission Logic
    submitPaymentButton.addEventListener('click', async () => {
        const { error } = await stripe.confirmSetup({
            elements,
            confirmParams: {
                return_url: window.location.origin + '/confirmation', // Change to your confirmation URL
            },
        });

        if (error) {
            alert(error.message);
        } else {
            paymentModal.style.display = 'none';
            alert('Payment method saved successfully!');
            // You can store the payment method ID in your database here
        }
    });

    // Order Submission Logic (your existing logic)
    submitOrderButton.addEventListener('click', () => {
        // Your existing order submission logic from confirmation.js
        console.log("order submitted");
    });
});

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
        <button id="editPaymentButton">Edit Payment</button>

        <div id="paymentModal" className="modal">
            <div className="modal-content">
                <span className="close">&times;</span>
                <h2>Payment Details</h2>
                <div id="payment-element">
                    </div>
                <button id="submitPayment">Save Payment</button>
            </div>
        </div>
        {/*
        <select className="payment-dropdown">
          <option value="paypal">PayPal</option>
          <option value="credit-card">Credit Card</option>
          <option value="cash">Cash</option>
        </select>
        */}
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
