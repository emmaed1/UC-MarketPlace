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
        <h3 className="cat-title">Browse Product Categories</h3>
        <ul className="category-list">
          <li>
            <a href="/products/1">Academic Materials</a>
          </li>
          <li>
            <a href="/products/2">Home Essentials</a>
          </li>
          <li>
            <a href="/products/3">Clothing</a>
          </li>
          <li>
            <a href="/products/4">Accesories</a>
          </li>
          <li>
            <a href="/products/5">Technology & Electronics</a>
          </li>
          <li>
            <a href="/products/6">Food & Beverage</a>
          </li>
          <li>
            <a href="/products/6">Entertainment</a>
          </li>
          <li>
            <a href="/products/6">Collectibles</a>
          </li>
          <li>
            <a href="/products/6">Miscellaneous</a>
          </li>
        </ul>

        <h3 className="cat-title">Browse Service Categories</h3>
        <ul className="category-list">
          <li>
            <a href="/services/1">Academic Help</a>
          </li>
          <li>
            <a href="/services/2">Technology Support</a>
          </li>
          <li>
            <a href="/services/3">Photography & Videography</a>
          </li>
          <li>
            <a href="/services/4">Beauty & Personal Care</a>
          </li>
          <li>
            <a href="/services/5">Automotive Services</a>
          </li>
          <li>
            <a href="/services/6">Creative Work</a>
          </li>
          <li>
            <a href="/services/7">Pet Services</a>
          </li>
          <li>
            <a href="/services/8">Entertainment & Event Planning</a>
          </li>
          <li>
            <a href="/services/9">Miscellaneous</a>
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
