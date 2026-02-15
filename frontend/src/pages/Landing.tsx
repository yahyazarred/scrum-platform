import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="landing-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <nav className="nav-bar">
          <div className="logo-section">
            <div className="logo-icon">S</div>
            <span className="logo-text">SCRUMBLE</span>
          </div>
          <button className="nav-login-btn" onClick={handleGetStarted}>
            Login
          </button>
        </nav>

        <div className="hero-content">
          <div className="badge">
            <span className="badge-dot"></span>
            Next-Gen Collaboration
          </div>
          
          <h1 className="hero-title">
            Transform Your
            <span className="gradient-text"> Workflow</span>
          </h1>
          
          <p className="hero-subtitle">
            Scrumble revolutionizes team collaboration with powerful tools 
            designed for modern agile teams. Experience seamless project 
            management like never before.
          </p>

          <div className="cta-buttons">
            <button className="primary-cta" onClick={handleGetStarted}>
              Get Started
              <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="secondary-cta">
              Watch Demo
              <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need to supercharge your team</p>
        </div>

        <div className="features-grid">
          <div className="feature-card card-1">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Lightning Fast</h3>
            <p>Experience blazing fast performance with our optimized infrastructure</p>
          </div>

          <div className="feature-card card-2">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                <path d="M3 9h18M9 21V9" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Smart Boards</h3>
            <p>Organize tasks with intelligent kanban boards and drag-drop simplicity</p>
          </div>

          <div className="feature-card card-3">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="9" cy="7" r="4" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Team Sync</h3>
            <p>Real-time collaboration with your team members across the globe</p>
          </div>

          <div className="feature-card card-4">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Secure</h3>
            <p>Enterprise-grade security with end-to-end encryption for your data</p>
          </div>

          <div className="feature-card card-5">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Analytics</h3>
            <p>Track progress with detailed insights and performance metrics</p>
          </div>

          <div className="feature-card card-6">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Time Tracking</h3>
            <p>Automatic time tracking and reporting for better productivity</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Team?</h2>
          <p>Join thousands of teams already using Scrumble to achieve more</p>
          <button className="cta-final-button" onClick={handleGetStarted}>
            Start Free Today
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo-section">
              <div className="logo-icon">S</div>
              <span className="logo-text">SCRUMBLE</span>
            </div>
            <p>Empowering teams to achieve excellence</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">Updates</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">Blog</a>
              <a href="#">Support</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Scrumble. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;