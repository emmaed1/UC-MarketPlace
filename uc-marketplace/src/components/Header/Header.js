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
            <li><a href="/services">Services</a></li>
            <li><a href="/contact-us">Contact Us</a></li>    
            {/* <li>Hello {userData.name}</li>
            <li>Cart: {userData.cartItems}</li> */}
        </ul>
        <ul>
            <li class="login-btn"><a href="/login">Login</a></li>
        </ul>
        </nav>
    )
}