import "./Home.css";
import logo from '../../assets/uc-MP-logo.png'

export default function Home() {
  return (
    <div className="content">
      <div className="welcome-content">
        <img src={logo} alt='uc marketplace-logo'></img>
        <div className="welcome-text">
            <h1>Welcome to UC MarketPlace</h1>
          </div>
      </div>
      <div className="categories">
        <h3 className="cat-title">Browse Categories</h3>
        <ul>
          <li>
            <a href="/products/1">Home Goods</a>
          </li>
          <li>
            <a href="/products/2">Technology</a>
          </li>
          <li>
            <a href="/products/3">Books</a>
          </li>
          <li>
            <a href="/products/4">UC Merch</a>
          </li>
          <li>
            <a href="/products/5">Dorm Supplies</a>
          </li>
          <li>
            <a href="/products/6">Shoes</a>
          </li>
        </ul>
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
              <td>UC MarketPlace gave me a central location to buy, sell, and promote my goods and services.</td>
              <td>I cannot thank UC MarketPlace enough for giving me a safe place to promote my goods.</td>
              <td>UC MarketPlace rocks!</td>
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
