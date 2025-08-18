import React from 'react';
import './EntrepreneurPage.css';
import Navbar from './Components/navbar.jsx';
import Footer from './Components/footer.jsx';

const EntrepreneurPage = () => {
  return (
    <div>
    <Navbar />
    <div className="cybersecurity-services">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1>Cybersecurity Services</h1>
          <p>
            Protecting your digital assets starts with proactive defense and expert awareness. 
            At <span className="company-name">VHASS</span>, we deliver advanced cybersecurity services 
            tailored to your organizations' needs—whether it's identifying vulnerabilities or 
            training your teams to be your first line of defense.
          </p>
        </div>
      </section>

      {/* Security Auditing Section */}
      <section className="auditing-section">
        <div className="container">
          <div className="section-header">
            <h2>Security Auditing</h2>
            <div className="tagline">
              Expose weaknesses before attackers do.
            </div>
          </div>
          
          <div className="content">
            <p>
              Our comprehensive security audits provide a detailed analysis of your digital infrastructure, 
              helping you stay compliant, resilient, and secure. We incorporate AI-driven threat analysis 
              and automated vulnerability scanning to enhance precision and efficiency in identifying 
              security gaps.
            </p>
            
            <div className="services-offered">
              <h3>What We Offer:</h3>
              <div className="services-grid">
                <div className="service-card">
                  <div className="card-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div className="card-content">
                    <h4>Network Security Audits</h4>
                    <p>
                      Comprehensive assessment of your network infrastructure to identify vulnerabilities 
                      and security weaknesses.
                    </p>
                  </div>
                </div>
                
                <div className="service-card">
                  <div className="card-icon">
                    <i className="fas fa-laptop-code"></i>
                  </div>
                  <div className="card-content">
                    <h4>Web Application Testing</h4>
                    <p>
                      In-depth analysis of web applications to detect security flaws and prevent 
                      potential breaches.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="additional-services">
        <div className="container">
          <h2>Our Comprehensive Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="card-icon">
                <i className="fas fa-bug"></i>
              </div>
              <div className="card-content">
                <h3>Penetration Testing</h3>
                <p>
                  Simulated cyber attacks to evaluate the security of your systems and identify vulnerabilities.
                </p>
              </div>
            </div>
            
            <div className="service-card">
              <div className="card-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="card-content">
                <h3>Security Training</h3>
                <p>
                  Customized training programs to educate your team on security best practices and threat awareness.
                </p>
              </div>
            </div>
            
            <div className="service-card">
              <div className="card-icon">
                <i className="fas fa-headset"></i>
              </div>
              <div className="card-content">
                <h3>Incident Response</h3>
                <p>
                  Rapid response and recovery services to minimize damage in the event of a security breach.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Secure Your Business?</h2>
          <p>
            Contact us today for a comprehensive security assessment and take the first step towards 
            robust digital protection.
          </p>
          <button className="cta-button">Schedule a Consultation</button>
        </div>
      </section>
    </div>
    <Footer />
    </div>
  );
};

export default EntrepreneurPage;