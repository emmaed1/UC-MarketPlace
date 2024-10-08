import "./AccountView.css";
import logo from '../../assets/uc-MP-logo.png'

export default function A() {
  return (
    <div className="content">
      <div className="welcome-content">
        <img src={logo} alt='uc marketplace-logo'></img>
          <div className="welcome-text">
            <h1>Welcome to Your Account</h1>
          </div>
      </div>
      <div className="listings">
        <h3 className="list-title">View Your Current Listings</h3>
        <ul>
          <li>
            <div className="imgresize"><img src={logo} alt='uc marketplace-logo'></img></div>
            <a href="/listing/1">Listing 1</a>
          </li>
          <li>
          <div className="imgresize"><img src={logo} alt='uc marketplace-logo'></img></div>
            <a href="/listing/2">Listing 2</a>
          </li>
          <li>
          <div className="imgresize"><img src={logo} alt='uc marketplace-logo'></img></div>
            <a href="/listing/3">Listing 3</a>
          </li>
        </ul>
      </div>

    <div className="newlisting-reviews-container">

      <div className="newlisting">
        <h3 className="newlist-title">Have another product or service to sell?</h3>
        <a href="/new-listing">Create Listing</a>
      </div>

      <div className="reviews">
        <h2>Seller Reviews</h2>
        <p>Hear from students who have purchased from this seller.</p>
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
