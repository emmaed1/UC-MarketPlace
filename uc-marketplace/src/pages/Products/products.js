import "./products.css";
import ProductsCard from "./productsCard";
import { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({ minPrice: "", maxPrice: "" });
  const [filterCriteria, setFilterCriteria] = useState({ minPrice: "", maxPrice: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:3001/products", { method: "GET" })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log("Error getting products", err));
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

  const clearFilters = () => {
    setAppliedFilters({ minPrice: "", maxPrice: "" });
    setFilterCriteria({ minPrice: "", maxPrice: "" });
    setSearchQuery("");   // Clears search input field
    setSearchTerm("");    // Clears applied search filter
    setIsSearchTriggered(true); 
  };
  

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !isSearchTriggered ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      (!appliedFilters.minPrice || product.price >= parseFloat(appliedFilters.minPrice)) &&
      (!appliedFilters.maxPrice || product.price <= parseFloat(appliedFilters.maxPrice));

    return matchesSearch && matchesPrice;
  });

  return (
    <>
      <div className="content">
        <div className="products-content">
          <div className="products-text">
            <h1>Explore Products</h1>
            <p>Find products tailored to your academic needs and beyond.</p>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            id="search"
            placeholder="Search for products..."
            value={searchQuery}
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
            <button onClick={applyFilters}style={{ marginLeft: "10px" }}>Apply</button>
            <button onClick={clearFilters} style={{ marginLeft: "10px"}}>Clear Filters</button>
          </div>
        )}

        <div className="products-content">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <ProductsCard key={item.productId} {...item} />
            ))
          ) : (
            <p>No products found. Try using filters to refine your search.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
