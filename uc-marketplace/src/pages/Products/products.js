import "./products.css";
import ProductsCard from "./productsCard";
import { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]); // Store the products
  const [searchQuery, setSearchQuery] = useState(""); // Store the search query

  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch all products
  const fetchProducts = () => {
    fetch('http://localhost:3001/products', { method: "GET" })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log("Error getting products", err));
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          />
        </div>

        <div className="products-content">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <ProductsCard key={item.productId} {...item} />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
