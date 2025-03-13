import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import cartContext from "../../components/ShoppingCart/Context/CartContext";

const stripePromise = loadStripe('pk_test_51Qyy4aKCv8fIXaN0RXYuZGuKmD19pibpZRuFYtHeFkZmV9nCZ3o5nESKDEkZedec96SSwLrmLB19pKFtdIZPR5Ec00zB3bezLw');

const PaymentForm = ({ clientSecret, onClosePaymentModal, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setLoading(false);
            setErrorMessage(submitError.message);
            return;
        }

        const { error: paymentError } = await stripe.confirmPayment({
            clientSecret,
            elements,
            redirect: 'if_required'
        });

        setLoading(false);

        if (paymentError) {
            setErrorMessage(paymentError.message);
        } else {
            setShowSuccessPopup(true);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessPopup(false);
        onClosePaymentModal();
    };

    return React.createElement(
        'div',
        { className: 'payment-form-container' },
        React.createElement(
            'div',
            { className: 'payment-form-header' },
            React.createElement('h3', null, 'Enter Payment Details'),
            React.createElement(
                'button',
                { 
                    className: 'close-button',
                    onClick: onCancel,
                    type: 'button'
                },
                '×'
            )
        ),
        React.createElement(
            'form',
            { onSubmit: handleSubmit },
            React.createElement(PaymentElement, null),
            React.createElement(
                'button',
                { 
                    disabled: !stripe || loading,
                    className: 'save-payment-button'
                },
                loading ? 'Processing...' : 'Save Payment'
            ),
            errorMessage && React.createElement('div', { style: { color: 'red' } }, errorMessage)
        ),
        showSuccessPopup && React.createElement(
            'div',
            { className: 'popup-overlay' },
            React.createElement(
                'div',
                { className: 'popup-content' },
                React.createElement('p', null, 'Payment method saved successfully!'),
                React.createElement(
                    'button',
                    { onClick: handleSuccessClose },
                    'OK'
                )
            )
        )
    );
};

const Checkout = () => {
    const navigate = useNavigate();
    const { clearCart } = useContext(cartContext);
    const [cartData, setCartData] = useState({ items: [], total: 0 });
    const [clientSecret, setClientSecret] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentIntentLoading, setPaymentIntentLoading] = useState(false);
    const [paymentIntentError, setPaymentIntentError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const cartParam = params.get('cart');

        if (cartParam) {
            try {
                const decodedCart = JSON.parse(decodeURIComponent(cartParam));
                setCartData(decodedCart);
            } catch (error) {
                console.error('Error parsing cart data:', error);
            }
        }
    }, []);

    const handleEditPayment = async () => {
        setPaymentIntentLoading(true);
        setPaymentIntentError(null);
        try {
            const response = await fetch('http://localhost:3001/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: cartData.total * 100 }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { clientSecret } = await response.json();
            setClientSecret(clientSecret);
            setShowPaymentModal(true);
        } catch (error) {
            console.error('Error fetching client secret:', error);
            setPaymentIntentError("Failed to load payment options. Please try again.");
        } finally {
            setPaymentIntentLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        setPaymentSuccess(true);
        setShowPaymentModal(false);
    };

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
    };

    const handleSubmitOrder = () => {
        if (paymentSuccess) {
            setPopupMessage("Order submitted successfully!");
            setShowPopup(true);
        } else {
            alert("Please save payment method before submitting order.");
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        if (paymentSuccess) {
            clearCart();
            const formattedItems = cartData.items.map(item => ({
                title: item.name,
                price: item.price,
                quantity: item.quantity
            }));
            
            navigate("/confirmation", {
                state: {
                    cartItems: formattedItems,
                    cartTotal: cartData.total,
                    paymentMethod: "Credit Card"
                },
            });
        }
    };

    const Popup = ({ message, onClose }) => (
        showPopup ? React.createElement(
            'div',
            { className: 'popup-overlay' },
            React.createElement(
                'div',
                { className: 'popup-content' },
                React.createElement('p', null, message),
                React.createElement('button', { onClick: onClose }, 'OK')
            )
        ) : null
    );

    return React.createElement(
        'div',
        { className: 'checkout-page' },
        React.createElement('h1', { className: 'checkout-title' }, 'Checkout'),
        React.createElement(
            'div',
            { className: 'cart-section' },
            React.createElement('h2', null, 'Your Cart'),
            cartData.items.length > 0
                ? cartData.items.map((item, index) =>
                    React.createElement(
                        'div',
                        { className: 'cart-item', key: index },
                        React.createElement(
                            'div',
                            { className: 'item-details' },
                            React.createElement('h4', { className: 'item-title' }, item.name),
                            React.createElement('p', { className: 'item-price' }, `Price: $${item.price.toFixed(2)}`),
                            React.createElement('p', { className: 'item-quantity' }, `Quantity: ${item.quantity}`),
                            React.createElement('p', { className: 'item-subtotal' }, `Subtotal: $${(item.price * item.quantity).toFixed(2)}`)
                        )
                    )
                )
                : React.createElement('p', { className: 'empty-cart' }, 'Your cart is empty.')
        ),
        React.createElement(
            'div',
            { className: 'total-section' },
            React.createElement('h3', null, 'Total Price:'),
            React.createElement('p', { className: 'cart-total' }, `$${cartData.total.toFixed(2)}`)
        ),
        React.createElement(
            'div',
            { className: 'payment-section' },
            React.createElement('h3', null, 'Payment Method'),
            paymentSuccess && React.createElement(
                'div',
                { className: 'payment-status' },
                React.createElement('p', null, 
                    React.createElement('span', { className: 'status-label' }, 'Status: '),
                    React.createElement('span', { className: 'status-value success' }, 'Payment Method Saved ✓')
                ),
                React.createElement('p', null, 
                    React.createElement('span', { className: 'method-label' }, 'Method: '),
                    React.createElement('span', { className: 'method-value' }, 'Credit Card')
                )
            ),
            React.createElement(
                'button',
                { 
                    onClick: handleEditPayment, 
                    disabled: paymentIntentLoading,
                    className: paymentSuccess ? 'edit-button' : 'primary-button'
                },
                paymentIntentLoading ? 'Loading...' : (paymentSuccess ? 'Change Payment Method' : 'Add Payment Method')
            ),
            paymentIntentError && React.createElement('p', { style: { color: 'red' } }, paymentIntentError),
            showPaymentModal && clientSecret && React.createElement(
                Elements,
                { stripe: stripePromise, options: { clientSecret } },
                React.createElement(PaymentForm, {
                    clientSecret: clientSecret,
                    onClosePaymentModal: handlePaymentSuccess,
                    onCancel: handleClosePaymentModal
                })
            )
        ),
        React.createElement(
            'button',
            { className: 'submit-button', onClick: handleSubmitOrder },
            'Submit Order'
        ),
        React.createElement(Popup, { message: popupMessage, onClose: closePopup })
    );
};

export default Checkout;