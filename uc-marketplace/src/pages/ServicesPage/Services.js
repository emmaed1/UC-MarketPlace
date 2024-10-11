import "./Services.css";
import logo from '../../assets/uc-MP-logo.png';

export default function ServicesView() {
  return (
    <div className="services-content">
      <div className="banner">
        <img src={logo} alt='uc-marketplace-logo' className="banner-logo" />
        <div className="banner-text">
          <h1>Explore Our Services</h1>
          <p>Find the services tailored to your academic needs and beyond.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search services..."
        />
      </div>

      <div className="services-listings">
        <h3 className="list-title">Popular Services</h3>
        <ul className="service-items">
          {[1, 2, 3].map(id => (
            <li key={id}>
              <div className="img-resize">
                <img src={logo} alt={`Service ${id} Image`} />
              </div>
              <a href={`/service/${id}`}>Service {id}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="features-container">
        <div className="featured-section">
          <h3 className="featured-title">Special Offers</h3>
          <a href="/special-offers">View Offers</a>
        </div>

        <div className="featured-section">
          <h3 className="featured-title">Top Services</h3>
          <a href="/top-services">Explore Now</a>
        </div>

        <div className="featured-section">
          <h3 className="featured-title">New Arrivals</h3>
          <a href="/new-arrivals">See What's New</a>
        </div>
      </div>
      
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <p>Find answers to common questions about our services.</p>
      </div>
    </div>
  );
}
