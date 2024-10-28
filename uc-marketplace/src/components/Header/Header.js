import { useContext } from 'react'
import Context from '../Context'
import './Header.css'
import logo from '../../assets/uc-MP-logo.png'

export default function Header() {
    // const userData = useContext(Context)
    return (
        <nav className="nav-bar">
            <img src={logo} alt='uc marketplace-logo' className='app-logo'></img>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/Services">Services</a></li>
            <li><a href="/contact-us">Contact Us</a></li>    
            <li><a href="/account-view">Account View</a></li> 
            {/* ACCOUNT VIEW link can be removed once there is a way to actually access it by
             logging in. I just have it here for testing purposes */}
             
            {/* <li>Hello {userData.name}</li>
            <li>Cart: {userData.cartItems}</li> */}
        </ul>
        <ul>
            <li class="login-btn"><a href="/login">Login</a></li>
        </ul>
        <div title='Cart' className="cart_icon">
            <img src="../../images/bag-icon.svg" alt="bag-icon"></img>
        </div>
        </nav>
    )
}