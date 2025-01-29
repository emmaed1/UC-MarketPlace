import "./Services.css"; 
import ServicesCard from './servicesCard'
import { useEffect, useState } from "react";

const Services = () => {
  const [services, setServices] = useState([]); // Store the services
  const [searchQuery, setSearchQuery] = useState(""); // Store the search input
  const [searchTerm, setSearchTerm] = useState(""); // Store the confirmed search term

  useEffect(() => {
    fetchServices();
  }, []);

  // Function to fetch all services
  const fetchServices = () => {
    fetch('http://localhost:3001/services', { method: "GET" })
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.log("Error getting services", err));
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle search execution on Enter key
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setSearchTerm(searchQuery);
    }
  };

  // Filter services based on confirmed search term
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content">
      <div className="banner">
        <div className="banner-text">
          <h1>Explore Our Services</h1>
          <p>Find the services tailored to your academic needs and beyond.</p>
        </div>
      </div>

      <div className="search-bar">
        <input 
          type="text" 
          id="search" 
          placeholder="Search for services..." 
          value={searchQuery}
          onChange={handleSearchChange} // Update search query
          onKeyDown={handleKeyPress} // Trigger search on Enter key press
        />
      </div>
      <div className="products-content">
        {filteredServices.length > 0 ? (
          filteredServices.map((item) => (
            <ServicesCard key={item.serviceId} {...item} />
          ))
        ) : (
          <p>No services found.</p>
        )}
      </div>
      <div className="features-container">
        <div className="featured-section">
          <h3 className="featured-title">Special Offers</h3>
          <a href="/special-offers">View Offers</a>
        </div>

        <div className="featured-section">
          <h3 className="featured-title">Top Services</h3>
          <a href="/top-services">Explore Now</a>
        </div>

        <div className="featured-section">
          <h3 className="featured-title">New Arrivals</h3>
          <a href="/new-arrivals">See What's New</a>
        </div>
      </div>
      
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <p>Find answers to common questions about our services.</p>
      </div>
    </div>
  );
};

export default Services;
