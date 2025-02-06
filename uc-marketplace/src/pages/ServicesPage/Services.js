import "./Services.css"; 
import ServicesCard from './servicesCard'
import { useEffect, useState } from "react";

const Services = () => {
  const [services, setServices] = useState([]); // Store the services
  const [searchQuery, setSearchQuery] = useState(""); // Store the search input
  const [searchTerm, setSearchTerm] = useState(""); // Store the confirmed search term
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({ minPrice: "", maxPrice: "" });
  const [filterCriteria, setFilterCriteria] = useState({ minPrice: "", maxPrice: "" });

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setIsSearchTriggered(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setSearchTerm(searchQuery);
      setIsSearchTriggered(true);
    }
  };

  const toggleFilterPopup = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters(filterCriteria);
    setIsFilterOpen(false);
    setIsSearchTriggered(true); // Ensures search is triggered even if search bar is empty
  };

  const filteredServices= services.filter((service) => {
    const matchesSearch =
      !isSearchTriggered ||
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.desc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      (!appliedFilters.minPrice || service.price >= parseFloat(appliedFilters.minPrice)) &&
      (!appliedFilters.maxPrice || service.price <= parseFloat(appliedFilters.maxPrice));

    return matchesSearch && matchesPrice;
  });

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
        <button className="filter-button" onClick={toggleFilterPopup}>
            Filter
          </button>
      </div>

      {isFilterOpen && (
          <div className="filter-popup">
            <h3>Filter Options</h3>
            <label>Min Price:</label>
            <input
              type="number"
              name="minPrice"
              value={filterCriteria.minPrice}
              onChange={handleFilterChange}
            />
            <label>Max Price:</label>
            <input
              type="number"
              name="maxPrice"
              value={filterCriteria.maxPrice}
              onChange={handleFilterChange}
            />
            <button onClick={applyFilters}>Apply</button>
          </div>
        )}

      <div className="services-content">
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
