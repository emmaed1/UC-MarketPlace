import "./products.css";
import ProductsCard from "./productsCard";
import { useEffect, useState, useContext } from "react";
import MessageForm from "../../components/MessageForm"; // Import MessageForm component
import Context from "../../components/Context"; // Import Context

const Products = () => {
  const userInfo = useContext(Context); // Use context to get userInfo
  const userId = userInfo?.userId; // Get userId from userInfo

  const [products, getProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/products', { method: "GET" })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => getProducts(data))
      .catch(err => { console.log("Error getting products", err) });
  }, []);

  const handleChatClick = (product) => {
    setSelectedProduct(product);
  };

  console.log("userId:", userId); // Add this line to log the userId

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
              <ProductsCard {...product} onChatClick={handleChatClick} />
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