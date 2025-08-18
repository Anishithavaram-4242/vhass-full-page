import React from 'react';
import Navbar from './Components/navbar.jsx';
import './CybersecurityPage.css';
import Footer from './Components/footer.jsx';
function CybersecurityPage() {
  return (
    <div className="cybersecurity-page">
      <Navbar />
      
      <main className="main-content">
        <section className="hero-section">
          <h1>Cybersecurity Services</h1>
          <p className="hero-description">
            Protecting your digital assets starts with proactive defense and expert awareness. 
            At [Your Company Name], we deliver advanced cybersecurity services tailored to your 
            organization's needs—whether it's identifying vulnerabilities or training your teams 
            to be your first line of defense.
          </p>
        </section>

        <section className="service-section">
          <h2>Security Auditing</h2>
          <p className="service-tagline">Expose weaknesses before attackers do.</p>
          
          <p className="service-description">
            Our comprehensive security audits provide a detailed analysis of your digital 
            infrastructure, helping you stay compliant, resilient, and secure. We incorporate 
            AI-driven threat analysis and automated vulnerability scanning to enhance precision 
            and efficiency in identifying security gaps.
          </p>

          <h3>What We Offer:</h3>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-card-header">
                <div className="service-icon">🛡️</div>
                <h4 className="service-card-title">Network Security Audits</h4>
              </div>
              <p className="service-card-description">
                Identify open ports, misconfigured firewalls, and unauthorized access points.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-card-header">
                <div className="service-icon">🌐</div>
                <h4 className="service-card-title">Web Application Testing</h4>
              </div>
              <p className="service-card-description">
                Detect vulnerabilities such as SQL Injection, XSS, and authentication flaws.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-card-header">
                <div className="service-icon">☁️</div>
                <h4 className="service-card-title">Cloud Security Review</h4>
              </div>
              <p className="service-card-description">
                Assess misconfigured storage, access control issues, and cloud-native risks.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-card-header">
                <div className="service-icon">📋</div>
                <h4 className="service-card-title">Compliance & Risk Auditing</h4>
              </div>
              <p className="service-card-description">
                Ensure alignment with standards like ISO 27001, GDPR, PCI-DSS, and HIPAA.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-card-header">
                <div className="service-icon">🤖</div>
                <h4 className="service-card-title">AI-powered Vulnerability Assessment</h4>
              </div>
              <p className="service-card-description">
                Use of machine learning algorithms to detect complex patterns, unusual behaviors, and emerging threats.
              </p>
            </div>
            
            <div className="service-card">
              <div className="service-card-header">
                <div className="service-icon">📊</div>
                <h4 className="service-card-title">Report & Remediation Plan</h4>
              </div>
              <p className="service-card-description">
                Clear, actionable steps to fix discovered vulnerabilities.
              </p>
            </div>
          </div>

          <p className="service-cta">
            Let us secure your infrastructure before attackers can exploit it.
          </p>
        </section>

        <section className="service-section">
          <h2>Cybersecurity Training</h2>
          <p className="service-tagline">Turn your team into cyber defenders.</p>
          
          <p className="service-description">
            Empower your employees, IT staff, and professionals with hands-on cybersecurity 
            knowledge that goes beyond theory.
          </p>

          <h3>Our Training Programs Include:</h3>
          <ul className="training-list">
            <li>Ethical Hacking & Penetration Testing</li>
            <li>Incident Response & Threat Hunting</li>
            <li>Phishing Awareness & Social Engineering Defense</li>
            <li>Secure Coding Practices for Developers</li>
            <li>Cybersecurity for Business Leaders & Executives</li>
          </ul>

          <h3>Why Choose Us:</h3>
          <ul className="benefits-list">
            <li>Industry-certified trainers (CEH, OSCP, etc.)</li>
            <li>Custom modules for different roles (IT, HR, Management)</li>
            <li>Virtual, onsite, or hybrid delivery models</li>
            <li>Live simulations, labs, and CTFs (Capture The Flag)</li>
          </ul>

          <p className="service-cta">
            Build a cyber-aware culture within your organization.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default CybersecurityPage;