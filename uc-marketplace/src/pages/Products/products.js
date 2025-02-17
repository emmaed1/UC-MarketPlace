import { useEffect, useState } from "react";
import ProductsCard from "./productsCard";
import "./products.css";
import { useSearchParams } from 'react-router-dom';

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || "";
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    categories: initialCategory ? [initialCategory] : [],
  });
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    minPrice: "",
    maxPrice: "",
    categories: initialCategory ? [initialCategory] : [],
  });

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

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !appliedSearchTerm ||
      product.name.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
      product.desc.toLowerCase().includes(appliedSearchTerm.toLowerCase());

    const matchesPrice =
      (!appliedFilters.minPrice || product.price >= parseFloat(appliedFilters.minPrice)) &&
      (!appliedFilters.maxPrice || product.price <= parseFloat(appliedFilters.maxPrice));

    const matchesCategory =
      appliedFilters.categories.length === 0 || appliedFilters.categories.some(cat => product.categories.some(prodCat => prodCat.name === cat));

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
                  "Academic Materials",
                  "Clothing",
                  "Technology and Electronics",
                  "Entertainment",
                  "Home Essentials",
                  "Accesories",
                  "Food and Beverage",
                  "Collectibles",
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