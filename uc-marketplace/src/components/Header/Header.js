import React, { useContext } from "react";
import "./Header.css";
import logo from "../../assets/uc-MP-logo.png";
import cartContext from "../ShoppingCart/Context/CartContext";

const Header = () => {
  const { cartItems, toggleCart } = useContext(cartContext);
  const cartQuantity = cartItems.length;

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    window.location.reload();
  }

  return (
    <header className="navbar">
      <nav className="nav-bar">
        <div className="logo-container">
          <img src={logo} alt="UC MarketPlace Logo" className="app-logo" />
        </div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/contact-us">Contact Us</a></li>
          <li><a href="/account-view">Account View</a></li>
        </ul>
        <div className="nav-actions">
          <div className="cart-container" onClick={() => toggleCart(true)}>
            <button className="shopping-cart"></button>
            {cartQuantity >= 1 && <span className="badge">{cartQuantity}</span>}
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
    </header>
  );
};

export default Header;