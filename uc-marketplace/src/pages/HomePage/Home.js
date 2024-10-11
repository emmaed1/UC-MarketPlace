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
            <a href="/products/1">Category 1</a>
          </li>
          <li>
            <a href="/products/2">Category 2</a>
          </li>
          <li>
            <a href="/products/3">Category 3</a>
          </li>
          <li>
            <a href="/products/4">Category 4</a>
          </li>
          <li>
            <a href="/products/5">Category 5</a>
          </li>
          <li>
            <a href="/products/6">Category 6</a>
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
