import { useContext } from 'react'
import Context from '../Context'
import './Header.css'

export default function Header() {
    // const userData = useContext(Context)
    return (
        <nav className="nav-bar">
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/contact-us">Contact</a></li>    
            {/* <li>Hello {userData.name}</li>
            <li>Cart: {userData.cartItems}</li> */}
        </ul>
        <ul>
            <li class="login-btn"><a href="/login">Login</a></li>
        </ul>
        </nav>
    )
}