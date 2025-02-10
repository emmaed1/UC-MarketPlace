import { useEffect, useState } from "react";
import ProductsCard from "./productsCard";
import "./products.css";

const Products = () => {
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    categories: [],
  });
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:3001/products")
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
    setIsFilterOpen(false);
    setIsSearchTriggered(true);
  };

  const clearFilters = () => {
    setFilters({ minPrice: "", maxPrice: "", categories: [] });
    setSearchQuery("");
    setSearchTerm("");
    setIsSearchTriggered(true);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !isSearchTriggered ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      (!filters.minPrice || product.price >= parseFloat(filters.minPrice)) &&
      (!filters.maxPrice || product.price <= parseFloat(filters.maxPrice));

    const matchesCategory =
      filters.categories.length === 0 || filters.categories.includes(product.category);

    return matchesSearch && matchesPrice && matchesCategory;
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
            placeholder="Search for products..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
          />
          <button className="filter-button" onClick={toggleFilterPopup}>Filter</button>
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
                {['Academic Materials', 'Clothing', 'Technology and Electronics', 'Entertainment', 'Home Essentials', 'Accesories', 'Food and Beverage', 'Collectibles', 'Miscellaneous'].map((cat) => (
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
