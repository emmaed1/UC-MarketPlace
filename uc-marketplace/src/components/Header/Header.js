import React, { useContext } from "react";
// import Context from '../Context'
import "./Header.css";
import logo from "../../assets/uc-MP-logo.png";
// import cartLogo from "../../images/bag-icon.svg";
import cartContext from "../ShoppingCart/Context/CartContext";

const Header = () => {
  const { cartItems, toggleCart } = useContext(cartContext);
  const cartQuantity = cartItems.length;

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    window.location.reload();
  }

  return (
    <div className="navbar">
    <nav className="nav-bar">
      <img src={logo} alt="uc marketplace-logo" className="app-logo"></img>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/products">Products</a>
        </li>
        <li>
          <a href="/Services">Services</a>
        </li>
        <li>
          <a href="/contact-us">Contact Us</a>
        </li>
        <li>
          <a href="/account-view">Account View</a>
        </li>
        <li>
          <a href="/chatpage">Chat</a>
        </li>
        {/* ACCOUNT VIEW link can be removed once there is a way to actually access it by
             logging in. I just have it here for testing purposes */}

        {/* <li>Hello {userData.name}</li>
            <li>Cart: {userData.cartItems}</li> */}
      </ul>
      <div class="logout-btn">
        <ul>
          <li >
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
      <div title="Cart" className="cart_icon" onClick={() => toggleCart(true)}>
        <button className="shopping-cart"></button>
        {cartQuantity >= 1 && <span className="badge">{cartQuantity}</span>}
      </div>
    </nav>
    </div>
  );
};

export default Header;
