
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  
  

  

  return (
    <div className="landing-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');

        :root {
          --primary-cyan: #00d4ff;
          --primary-blue: #1a4d7a;
          --deep-blue: #0a1f3d;
          --accent-orange: #ff8c3a;
          --accent-red: #ff4444;
          --silver: #c0d0e0;
          --dark-purple: #1a0f2e;
        }

        body {
          font-family: 'Space Mono', monospace;
          overflow-x: hidden;
          background: #000;
        }

        .landing-container {
          min-height: 100vh;
          position: relative;
          background: radial-gradient(
            var(--deep-blue) 0%,
            var(--dark-purple) 50%,
            #000 100%
          );
          overflow: hidden;
        }

        /* Animated background grid */
        .bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(var(--primary-cyan)22 1px, transparent 1px),
            linear-gradient(90deg, var(--primary-cyan)22 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.1;
          animation: gridMove 20s linear infinite;
          transform: perspective(500px) rotateX(60deg);
          transform-origin: center center;
        }

        @keyframes gridMove {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
        }

        /* Floating particles */
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--primary-cyan);
          border-radius: 50%;
          opacity: 0.6;
          animation: float linear infinite;
        }

        @keyframes float {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0;
          }
        }

        .content-wrapper {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 2rem;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          opacity: 0;
          animation: fadeSlideDown 1s ease forwards;
        }

        @keyframes fadeSlideDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary-cyan), var(--accent-orange));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 4px;
          text-transform: uppercase;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          color: var(--silver);
          text-decoration: none;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--primary-cyan), var(--accent-orange));
          transition: width 0.3s ease;
        }

        .nav-link:hover {
          color: var(--primary-cyan);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        /* Hero Section */
        .hero-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        .hero-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(3rem, 8vw, 7rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          opacity: 0;
          animation: heroAppear 1s ease 0.3s forwards;
        }

        @keyframes heroAppear {
          to {
            opacity: 1;
            transform: translateY(0);
          }
          from {
            opacity: 0;
            transform: translateY(30px);
          }
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--primary-cyan) 0%, var(--accent-orange) 50%, var(--accent-red) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.3rem);
          color: var(--silver);
          max-width: 700px;
          margin-bottom: 3rem;
          line-height: 1.8;
          opacity: 0;
          animation: heroAppear 1s ease 0.5s forwards;
        }

        .hero-subtitle span {
          color: var(--accent-orange);
          font-weight: 700;
        }

        /* CTA Buttons */
        .cta-container {
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          justify-content: center;
          opacity: 0;
          animation: heroAppear 1s ease 0.7s forwards;
        }

        .cta-button {
          padding: 1.2rem 3rem;
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          border: none;
          border-radius: 0;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .cta-primary {
          background: linear-gradient(135deg, var(--primary-cyan), var(--accent-orange));
          color: #000;
          box-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
        }

        .cta-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .cta-primary:hover::before {
          left: 100%;
        }

        .cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 40px rgba(0, 212, 255, 0.5);
        }

        .cta-secondary {
          background: transparent;
          color: var(--primary-cyan);
          border: 2px solid var(--primary-cyan);
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
        }

        .cta-secondary:hover {
          background: var(--primary-cyan);
          color: #000;
          transform: translateY(-3px);
          box-shadow: 0 10px 40px rgba(0, 212, 255, 0.4);
        }

        /* Features Preview */
        .features-preview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 6rem;
          opacity: 0;
          animation: heroAppear 1s ease 0.9s forwards;
        }

        .feature-card {
          padding: 2rem;
          background: rgba(26, 77, 122, 0.1);
          border: 1px solid rgba(0, 212, 255, 0.2);
          backdrop-filter: blur(10px);
          position: relative;
          transition: all 0.3s ease;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--primary-cyan), var(--accent-orange));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary-cyan);
          box-shadow: 0 10px 40px rgba(0, 212, 255, 0.2);
        }

        .feature-card:hover::before {
          transform: scaleX(1);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          display: inline-block;
        }

        .feature-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-cyan);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .feature-description {
          color: var(--silver);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .logo-text {
            font-size: 1.5rem;
          }

          .cta-container {
            flex-direction: column;
            width: 100%;
            padding: 0 1rem;
          }

          .cta-button {
            width: 100%;
          }

          .features-preview {
            grid-template-columns: 1fr;
            margin-top: 3rem;
          }
        }

        /* Glowing cursor effect */
        .cursor-glow {
          position: fixed;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%);
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: opacity 0.3s ease;
          z-index: 9999;
        }
      `}</style>

      <div className="bg-grid"></div>
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${10 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      <div className="content-wrapper">
        {/* Header */}
        <header className="header">
          <div className="logo-section">
            <div className="logo-text">SCRUMBLE</div>
          </div>
          <nav className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">
            <span className="gradient-text">ELEVATE YOUR</span>
            <br />
            AGILE WORKFLOW
          </h1>
          
          <p className="hero-subtitle">
            Transform chaos into <span>velocity</span>. Scrumble brings precision engineering 
            to agile project management with real-time collaboration, intelligent sprint planning, 
            and data-driven insights.
          </p>

          <div className="cta-container">
            <button 
              className="cta-button cta-primary"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </button>
            <button 
              className="cta-button cta-secondary"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>

          {/* Features Preview */}
          <div className="features-preview">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Sprint Velocity</h3>
              <p className="feature-description">
                Track team performance with real-time metrics and predictive analytics
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Smart Planning</h3>
              <p className="feature-description">
                AI-assisted story estimation and intelligent backlog prioritization
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3 className="feature-title">Live Sync</h3>
              <p className="feature-description">
                Real-time collaboration with instant updates across all team members
              </p>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default Landing;
