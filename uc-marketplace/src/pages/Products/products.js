import "./products.css";
import productsData from "./productsData";
import ProductsCard from "./productsCard";
import { useEffect, useState } from "react";

const Products = () => {
  // const products = productsData
  useEffect(() => {
      fetch('http://localhost:3001/products', {method: "GET"})
        .then(res => res.json())
        .then(data => getProducts(data))
        .catch(err => {console.log("Error getting products", err)});
  }, []);

  const [products, getProducts] = useState([]);

  return (
    <>
      {/* Content Section */}
      <div className="content">
        <div className="products-content">
          <div className="products-text">
            <h1>Explore Products</h1>
            <p>Find products tailored to your academic needs and beyond.</p>
          </div>
        </div>

        <div className="search-bar">
          <input type="text" id="search" placeholder="Search for products..." />
        </div>
        <div className="products-content">
          {products.map((item) => (
            <ProductsCard key={item.productId}{...item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Products;
