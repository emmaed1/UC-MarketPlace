import "./Home.css";
import logo from '../../assets/uc-MP-logo.png';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName, isProduct) => {
    const basePath = isProduct ? "/products" : "/services";
    navigate(`${basePath}?category=${categoryName}`);
  };

  return (
    <div className="content">
      <div className="welcome-content">
        <img src={logo} alt='uc marketplace-logo'></img>
        <div className="welcome-text">
          <h1>Welcome to UC MarketPlace</h1>
        </div>
      </div>
      <div className="categories">
        <div className="category-section">
          <h3 className="cat-title">Browse Product Categories</h3>
          <ul className="category-list">
            {[
              "Academic Materials", "Home Essentials", "Clothing", "Accesories",
              "Technology and Electronics", "Food and Beverage", "Entertainment",
              "Collectibles", "Miscellaneous"
            ].map(category => (
              <li key={category}>
                <a 
                  href="#"
                  onClick={() => handleCategoryClick(category, true)}
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="category-section">
          <h3 className="cat-title">Browse Service Categories</h3>
          <ul className="category-list">
            {[
              "Academic Help", "Technology Support", "Photography and Videography",
              "Beauty and Personal Care", "Automotive Services", "Creative Work",
              "Pet Services", "Entertainment and Event Planning", "Miscellaneous"
            ].map(category => (
              <li key={category}>
                <a 
                  href="#"
                  onClick={() => handleCategoryClick(category, false)}
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="reviews">
        <h2>Student Testimonials</h2>
        <p>Hear from students who have successfully used our marketplace.</p>
        <div className="review-cards">
          <table>
            <tr className="review-header">
              <th>Student 1</th>
              <th>Student 2</th>
              <th>Student 3</th>
            </tr>
            <tr className="review-content">
              <td>great!</td>
              <td>awesome!</td>
              <td>cool!</td>
            </tr>
          </table>
        </div>
      </div>
      <div className="faq">
        <h2>Frequently Asked Questions</h2>
        <p>Find answers to common questions about our platform and services.</p>
        <div className="faq-cards">
          
        </div>
      </div>
    </div>
  );
}