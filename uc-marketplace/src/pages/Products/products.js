import "./products.css";
import productsData from "./productsData";
import ProductsCard from "./productsCard";
import logo from '../../assets/uc-MP-logo.png'

const Products = () => {
  return (
    <>
      {/* Content Section */}
      <div className="content">
        <div className="welcome-content">
        <img src={logo} alt='uc-marketplace-logo' className="banner-logo" />
          <div className="welcome-text">
            <h1>Explore Products</h1>
            <p>Find products tailored to your academic needs and beyond.</p>
          </div>
        </div>
      </div>
      <div className="search-bar">
        <input type="text" id="search" placeholder="Search for products..." /> 
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
