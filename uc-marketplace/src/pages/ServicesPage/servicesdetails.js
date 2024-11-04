import { useParams, Link } from 'react-router-dom';
import "./Services.css"; // Make sure to create a CSS file for styling
import logo from '../../assets/uc-MP-logo.png';
import servicesData from './servicesData';

const ServiceDetails = () => {
    const { id } = useParams();
    const service = servicesData[id];

    return (
        <div>
            <div className="service-details">
                <div className="service-image">
                    <img 
                        src={logo} 
                        alt={service ? `${service.title} Image` : "Service Image Not Available"} 
                    />
                </div>
                <div className="service-description">
                    {service ? (
                        <>
                            <h2 className="service-title">{service.title}</h2>
                            <p>{service.description}</p>
                            <p className="service-price">Price: {service.price}</p>
                            <Link to="/request-service" className='request-button'>Book Service</Link>
                            
                            <div className="provider-info">
                                <img src="path_to_provider_profile_image.jpg" alt="Provider Profile Image" className="provider-profile-img" />
                                <div className="provider-details">
                                    <a href="/account-view" className="provider-name">Provider Name</a> 
                                    <p className="provider-description">Specializing in [service type or category the provider specializes in]</p>
                                </div>
                            </div>

                            {/* Message the Seller Button */}
                            <Link to="/message-seller" className="message-button">Message the Seller</Link>
                            
                            <Link to="/services" className="service-button">Back to Services</Link>
                        </>
                    ) : (
                        <div>
                            <Link to="/services" className="service-button">Back to Services</Link>
                            <p>Service not found</p>
                        </div>
                    )}
                </div>   
            </div>
        
            <div className="reviews">
                <h2>Provider Reviews</h2>
                <p>See what other students say about this provider:</p>
                <div className="review-cards">
                    <table>
                        <thead>
                            <tr className="review-header">
                                <th>Student 1</th>
                                <th>Student 2</th>
                                <th>Student 3</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="review-content">
                                <td>great!</td>
                                <td>awesome!</td>
                                <td>cool!</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ServiceDetails;