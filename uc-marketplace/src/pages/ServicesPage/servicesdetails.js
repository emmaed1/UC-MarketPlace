import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import "./Services.css"; 
import servicesData from "./servicesData";
import BookingCalendar from "./BookingCalender"; 

const ServiceDetails = () => {
    const { id } = useParams();
    const service = servicesData.find((item) => item.id === parseInt(id));
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleCloseCalendar = () => {
        setIsCalendarOpen(false);
    };

    return (
        <div>
            <div className="service-details">
                <div className="service-image">
                    <img 
                        src={service?.img || "https://via.placeholder.com/300"} 
                        alt={service ? `${service.title} Image` : "Service Image Not Available"} 
                        className="service-img"
                    />
                </div>
                <div className="service-description">
                    {service ? (
                        <>
                            <h2 className="service-title">{service.title}</h2>
                            <p>{service.description}</p>
                            <p className="service-price">Price: ${service.price.toLocaleString()}</p>
                            <button 
                                className="service-button" 
                                onClick={() => setIsCalendarOpen(true)}
                            >
                                Book Service
                            </button>
                            <div className="provider-info">
                                <img 
                                    src="https://via.placeholder.com/100" 
                                    alt="Provider Profile Image" 
                                    className="provider-profile-img" 
                                />
                                <div className="provider-details">
                                    <a href="/account-view" className="provider-name">Provider Name</a> 
                                    <p className="provider-description">Specializing in [service type or category the provider specializes in]</p>
                                </div>
                            </div>
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
            {isCalendarOpen && (
                <div className="calendar-modal">
                    <BookingCalendar onClose={handleCloseCalendar} />
                </div>
            )}
        </div>
    );
};

export default ServiceDetails;
