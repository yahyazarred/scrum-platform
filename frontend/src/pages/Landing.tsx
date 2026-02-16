
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-content">
        <div className="main-visual">
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
          <div className="glow-orb orb-3"></div>
        </div>

        <div className="content-wrapper">
          <h1 className="main-title">
            Welcome to <span className="highlight">Scrumble</span>
          </h1>
          <br/>
          <p className="tagline">
            a scrum based project management plateform 
            <br/>
            for maximum efficiency and optimal results
          </p>

          <div className="feature-highlights">
            <div className="highlight-item">
              <span className="highlight-number">01</span>
              <span className="highlight-text">Lightning Fast</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-number">02</span>
              <span className="highlight-text">Ultra Secure</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-number">03</span>
              <span className="highlight-text">extremely efficient</span>
            </div>
          </div>

          <button className="cta-button" onClick={() => navigate('/auth')}>
            Get started!
            <span className="button-glow"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;