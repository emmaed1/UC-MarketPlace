import "./products.css";
import ProductsCard from "./productsCard";
import { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]); // Store the products
  const [searchQuery, setSearchQuery] = useState(""); // Store the search input
  const [searchTerm, setSearchTerm] = useState(""); // Store the confirmed search term
  const [isSearchTriggered, setIsSearchTriggered] = useState(false); // Track if search should be applied

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch all products
  const fetchProducts = () => {
    fetch("http://localhost:3001/products", { method: "GET" })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log("Error getting products", err));
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setIsSearchTriggered(false); // Reset search trigger
  };

  // Handle search execution on Enter key
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setSearchTerm(searchQuery);
      setIsSearchTriggered(true);
    }
  };

  // Apply filtering only when search is triggered
  const filteredProducts = isSearchTriggered
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.desc.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

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
            onChange={handleSearchChange} // Update search query
            onKeyDown={handleKeyPress} // Trigger search on Enter key press
          />
        </div>

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
