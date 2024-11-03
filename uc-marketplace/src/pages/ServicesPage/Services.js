import { Link } from 'react-router-dom';
import "./Services.css"; // Make sure to create a CSS file for services
import logo from '../../assets/uc-MP-logo.png';

export default function Services() {
    return (
        <div>
            {/* Content Section */}
            <div className="content">
                <div className="welcome-content">
                    <div className="welcome-text">
                        <h1>Services</h1>
                    </div>
                </div>
            </div>
            
            {/* Service Listing Section */}
            <div className="container">
                <div className="search-bar">
                    <input type="text" id="search" placeholder="Search for Services..." /> 
                </div>
                <div className="services">
                    <ul className="service-items">
                        {[1, 2, 3,].map(id => (
                            <li className="service-item" key={id}>
                                <div className="imgresize">
                                    <img src={logo} alt={`Service ${id} Image`} />
                                </div>
                                <Link to={`/services/${id}`} className="service-link">Service {id}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
