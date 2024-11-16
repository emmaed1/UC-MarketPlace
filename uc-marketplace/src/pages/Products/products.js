import "./products.css";
import productsData from "./productsData";
import ProductsCard from "./productsCard";
import { useEffect, useState } from "react";

const Products = () => {
  const products = productsData
  useEffect(() => {
    // getProducts();
  }, []);

  // const [products, setProducts] = useState([]);

  // const getProducts= async () => {
  //   try {
  //     const postsData = await prisma.post.findMany();
  //   } catch (error){
  //       console.error('Error fetching products:', error);
  //   }
  //   };

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
            <ProductsCard key={item.id}{...item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Products;
