import React from "react";
import "./footer.css";
import { FaPaperPlane, FaMapMarkerAlt, FaPhone, FaEnvelope, FaChevronRight } from "react-icons/fa";
import {
  AiFillLinkedin, 
  AiFillYoutube, 
  AiFillInstagram 
} from "react-icons/ai";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-brand">
              <img src="./vhass-logo.png" alt="VHASS Cybersecurity" className="footer-logo" />
              <p className="footer-description">
                Empowering the digital world with cutting-edge cybersecurity education and solutions.
              </p>
            </div>

            <div className="footer-links-container">
              <div className="footer-links-col">
                <h4 className="footer-title">Quick Links</h4>
                <ul className="footer-links">
                  <li><Link to="/"><FaChevronRight /> Home</Link></li>
                  <li><Link to="/courses"><FaChevronRight /> Courses</Link></li>
                  <li><Link to="/workshop"><FaChevronRight /> Workshop</Link></li>
                  <li><Link to="/entrepreneur"><FaChevronRight /> Entrepreneur</Link></li>
                  <li><Link to="/about"><FaChevronRight /> About Us</Link></li>
                  <li><Link to="/contacts"><FaChevronRight /> HelpDesk</Link></li>
                </ul>
              </div>

              <div className="footer-links-col">
  <h4 className="footer-title">Courses</h4>
  <ul className="footer-links horizontal">
    <li><Link to="/courses"><FaChevronRight /> Ethical Hacking</Link></li>
    <li><Link to="/courses"><FaChevronRight /> Bounty Hunting</Link></li>
    <li><Link to="/courses"><FaChevronRight /> Awareness of Cyber Crime</Link></li>
    <li><Link to="/courses"><FaChevronRight /> Cyber Security for Teenagers</Link></li>
    <li><Link to="/courses"><FaChevronRight /> Entrepreneurship for Beginners</Link></li>
  </ul>
</div>


              <div className="footer-links-col">
                <h4 className="footer-title">Contact Us</h4>
                <ul className="footer-contact">
                  <li><FaMapMarkerAlt /> <span>#2-1-70, Brilliants School Area,<br />Ibrahimpatnam Krishna - 521 456,<br />Andhra Pradesh</span></li>
                  <li><FaPhone /> +91 8985320226</li>
                  <li><FaEnvelope /> info@vhass.in</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-social">
            <h5>Follow Us</h5>
            <div className="social-links">
              <a href="https://www.linkedin.com/company/vhass-softwares-private-limited/" aria-label="LinkedIn">
                <AiFillLinkedin size={20} />
              </a>
              <a href="https://www.youtube.com/@Vhass-d6g" aria-label="YouTube">
                <AiFillYoutube size={20} />
              </a>
              <a href="https://www.instagram.com/vhass_official" aria-label="Instagram">
                <AiFillInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <p>&copy; {new Date().getFullYear()} VHASS Softwares Pvt. Ltd. All rights reserved.</p>
            <div className="legal-links">
              <Link to="/terms-and-conditions">Terms and Conditions</Link>
              <span>|</span>
              <Link to="/Refund-policy">Refund Policy</Link>
              <span>|</span>
              <Link to="/Privacy-policy">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
