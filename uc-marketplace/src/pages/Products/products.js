import "./products.css";
import ProductsCard from "./productsCard";
import { useEffect, useState } from "react";
import MessageForm from "../../components/MessageForm"; // Import MessageForm component

const Products = ({ userId }) => {
  useEffect(() => {
    fetch('http://localhost:3001/products', { method: "GET" })
      .then(res => res.json())
      .then(data => getProducts(data))
      .catch(err => { console.log("Error getting products", err) });
  }, []);

  const [products, getProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleChatClick = (product) => {
    setSelectedProduct(product);
  };

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
          {products.map((product) => (
            <div key={product.productId}>
              <ProductsCard {...product} />
              <button onClick={() => handleChatClick(product)}>Chat with Seller</button>
            </div>
          ))}
        </div>
      </div>
      {selectedProduct && (
        <MessageForm
          senderId={userId}
          receiverId={selectedProduct.sellerId}
          productId={selectedProduct.productId}
        />
      )}
    </>
  );
};

export default Products;