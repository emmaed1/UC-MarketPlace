import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./Services.css"; 
import logo from '../../assets/uc-MP-logo.png';
import BookingCalendar from './BookingCalender'; 

const ServiceDetails = (props) => {
    const { id} = useParams();
    const [service, getServices] = useState([]);
    // const service = servicesData[id];
    
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); 

    const handleCloseCalendar = () => {
        setIsCalendarOpen(false);
    };

    useEffect(() => {
        fetch(`http://localhost:3001/services/${id}`, { method: "GET" })
          .then((res) => res.json())
          .then((data) => getServices(data))
          .catch((err) => {
            console.log("Error getting services", err);
          });
      }, [id]);

        useEffect(() => {
          console.log(service);
        });

    return (
        <div>
            <div className="service-details">
                <div className="service-image">
                    <img 
                        src={service.img} key={id}
                        alt={service ? `${service.name} Image` : "Service Image Not Available"} 
                    />
                </div>
                <div className="service-description">
                    {service ? (
                        <>
                            <h2 className="service-title">{service.name}</h2>
                            <p>{service.description}</p>
                            <p  className="service-categories">
                            {service.categories && service.categories.length
                            ? service.categories.map((c) => c.name).join(", ")
                            : "No Category"}
                            </p>
                            <p className="service-price">Price: ${service.price}</p>
                            
                            {/* Book Service button */}
                            <button 
                                className="service-button" 
                                onClick={() => setIsCalendarOpen(true)}
                            >
                                Book Service
                            </button>

                            <div className="provider-info">
                                {/* <img src="path_to_provider_profile_image.jpg" alt="Profile Image" className="provider-profile-img" /> */}
                                <div className="provider-details">
                                    <p href="/account-view" className="provider-name">Seller:{" "}
                                    {service.user?.name || "Seller Name Not Available"}</p> 
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

            {/* Booking Calendar Modal */}
            {isCalendarOpen && (
                <div className="calendar-modal">
                    <BookingCalendar onClose={handleCloseCalendar} />
                </div>
            )}
        </div>
    );
};

export default ServiceDetails;
