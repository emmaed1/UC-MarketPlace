import "./products.css";
import productsData from "./productsData";
import ProductsCard from './productsCard'

const Products = () => {
  return (
    <>
      {/* Content Section */}
      <div className="content">
        <div className="welcome-content">
          <div className="welcome-text">
            <h1>Products</h1>
          </div>
        </div>
      </div>
      <div className="products-content">
        {productsData.map((item) => (
          <ProductsCard key={item.id} {...item} />
        ))}
      </div>
    </>
  );
};

export default Products;
