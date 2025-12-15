import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content fade-in-up">
            {/* Badge */}
            <div className="hero-badge">
              <span className="badge-text">🚀 Trusted by 10,000+ professionals</span>
            </div>

            {/* Main Heading */}
            <h1 className="hero-heading">
              The modern way to
              <span className="gradient-text">
                work with talent
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle">
              Connect with verified professionals. Streamline projects. Get work done faster with our all-in-one platform.
            </p>

            {/* CTA Buttons */}
            <div className="cta-buttons">
              {user ? (
                <Link to="/dashboard" className="btn-primary-large">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary-large">
                    Start for free
                  </Link>
                  <Link to="/login" className="btn-secondary-large">
                    Book a demo
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="stats-grid stagger-animation">
              <div className="stat-item">
                <div className="stat-number">24h</div>
                <div className="stat-label">Avg. response time</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.9/5</div>
                <div className="stat-label">Client rating</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Skills available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header fade-in-up">
            <h2 className="features-title">
              Everything you need to scale
            </h2>
            <p className="features-subtitle">
              From finding talent to managing projects and payments - we've got you covered.
            </p>
          </div>

          <div className="features-grid stagger-animation">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon blue">
                <span className="feature-icon-text">🎯</span>
              </div>
              <h3 className="feature-title">Smart matching</h3>
              <p className="feature-description">
                Our AI finds the perfect talent for your project based on skills, availability, and budget.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon green">
                <span className="feature-icon-text">⚡</span>
              </div>
              <h3 className="feature-title">Lightning fast</h3>
              <p className="feature-description">
                Get matched with professionals in hours, not weeks. Start your project tomorrow.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon purple">
                <span className="feature-icon-text">🔒</span>
              </div>
              <h3 className="feature-title">Secure payments</h3>
              <p className="feature-description">
                Escrow protection, milestone payments, and secure transactions for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container fade-in-up">
          <h2 className="cta-title">
            Ready to get started?
          </h2>
          <p className="cta-subtitle">
            Join thousands of professionals who trust GigConnect for their projects.
          </p>
          <div className="cta-buttons-bottom">
            {user ? (
              <Link to="/dashboard" className="btn-primary-large inline-link">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary-large inline-link">
                  Create free account
                </Link>
                <Link to="/login" className="btn-secondary-large inline-link">
                  Contact sales
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-container">
          <p className="footer-text">
            &copy; 2024 GigConnect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;