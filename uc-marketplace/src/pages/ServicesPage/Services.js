import ServicesCard from './servicesCard';
import { useEffect, useState } from "react";
import "./Services.css";
import { useSearchParams } from 'react-router-dom';

const Services = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || "";
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    categories: initialCategory ? [initialCategory] : [],
  });
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    minPrice: "",
    maxPrice: "",
    categories: initialCategory ? [initialCategory] : [],
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    fetch('http://localhost:3001/services', { method: "GET" })
      .then(res => res.json())
      .then(data => {
        console.log("Services data from API:", data); // Log to check if availability is included
        setServices(data);
      })
      .catch(err => console.log("Error getting services", err));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setAppliedSearchTerm(searchTerm);
    }
  };

  const toggleFilterPopup = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setFilters((prev) => ({
        ...prev,
        categories: checked
          ? [...prev.categories, value]
          : prev.categories.filter((cat) => cat !== value),
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setAppliedSearchTerm(searchTerm);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setFilters({ minPrice: "", maxPrice: "", categories: [] });
    setAppliedFilters({ minPrice: "", maxPrice: "", categories: [] });
    setSearchTerm("");
    setAppliedSearchTerm("");
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      !appliedSearchTerm ||
      service.name.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
      service.desc.toLowerCase().includes(appliedSearchTerm.toLowerCase());

    const matchesPrice =
      (!appliedFilters.minPrice || service.price >= parseFloat(appliedFilters.minPrice)) &&
      (!appliedFilters.maxPrice || service.price <= parseFloat(appliedFilters.maxPrice));

    const matchesCategory =
      appliedFilters.categories.length === 0 || appliedFilters.categories.some(cat => service.categories.some(prodCat => prodCat.name === cat));

    return matchesSearch && matchesPrice && matchesCategory;
  });

  return (
    <>
      <div className="content">
        <div className="services-content">
          <div className="services-text">
            <h1>Explore Our Services</h1>
            <p>Find the services tailored to your academic needs and beyond.</p>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for services..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
          />
          <button className="filter-button" onClick={toggleFilterPopup}>
            Filter
          </button>
        </div>

        {isFilterOpen && (
          <div className="filter-popup">
            <h3>Filter Options</h3>
            <label>Price </label>
            <div className="filter-section">
              <label>Min Price:</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-section">
              <label>Max Price:</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
            <div className="filter-section">
              <label>Category</label>
              <div className="category-options">
                {[
                  "Academic Help",
                  "Technology Support",
                  "Photography and Videography",
                  "Beauty and Personal Care",
                  "Automotive Services",
                  "Creative Work",
                  "Pet Services",
                  "Entertainment and Event Planning",
                  "Miscellaneous",
                ].map((cat) => (
                  <label key={cat} className="category-checkbox">
                    <input
                      type="checkbox"
                      name="categories"
                      value={cat}
                      checked={filters.categories.includes(cat)}
                      onChange={handleFilterChange}
                    />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <div className="filter-buttons">
              <button onClick={applyFilters}>Apply</button>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
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
          {/* ... (featured sections) */}
        </div>
        <div className="faq-section">
          {/* ... (FAQ section) */}
        </div>
      </div>
    </>
  );
};

export default Services;