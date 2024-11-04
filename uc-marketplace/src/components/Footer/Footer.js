import "./Footer.css";
import logo from "../../assets/uc-MP-logo.png";
import mapIcon from "../../assets/location-icon.png";
import phoneIcon from "../../assets/phone-icon.png";
import mailIcon from "../../assets/mail-icon.png";
import facebook from '../../assets/facebook.png'
import twitter from '../../assets/twitter.png'
import linkedin from '../../assets/linkedin.png'
import insta from '../../assets/insta.png'

const Footer = () => {
  return (
    <footer className="footer-content">
      <div className="footer-about">
        <p class="about">
          <span> About the company</span> Welcome to The University of Cincinnati Marketplace, your go-to online platform designed 
          exclusively for university students to buy and sell products and services in a safe and convenient 
          environment. Browse our website for affordable textbooks and furniture to offering tutoring services and handmade crafts.
        </p>
        <div className="icons">
          <a href="https://www.facebook.com/">
            <img src={facebook} class="facebook"></img>
          </a>
          <a href="https://www.twitter.com/">
          <img src={twitter} class="twitter"></img>
          </a>
          <a href="https://www.linkedin.com/">
          <img src={linkedin} class="linkedin"></img>
          </a>
          <a href="https://www.instagram.com/">
          <img src={insta} class="insta"></img>
          </a>
        </div>
      </div>
      <div className="footer-info">
        <div>
          <img src={mapIcon} className="map"></img>
          <p>
            <span> 2600 Clifton Ave </span> Cincinnati, OH
          </p>
        </div>
        <div>
          <img src={phoneIcon} className="phone"></img>
          <p> (+1) 513 556 6000</p>
        </div>
        <div>
          <img src={mailIcon} className="mail"></img>
          <p>ucmarketplace@uc.edu</p>
        </div>
      </div>
      <div className="footer-logo col-md-4 col-sm-6">
        <img src={logo}></img>
        <p className="menu">
          <a href="#"> Home</a> |<a href="products"> Products</a> |
          <a href="services"> Services</a> |<a href="contact-us"> Contact Us</a>
        </p>
        <p>Copyright &copy; 2024 All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
