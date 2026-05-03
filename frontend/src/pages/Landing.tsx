import { useNavigate } from "react-router-dom";
import logo from "../assets/ScrumbleLogo2.png";
import landingShape from "../assets/landing-page-shape.png";
import landingGraphic from "../assets/landing-page-graphic.png";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-content">
        <img src={landingShape} alt="Landing Decor Shape" className="landing-bottom-shape" />
        <img src={landingGraphic} alt="Landing Decor Shape" className="landing-graphic" />
        <div className="content-wrapper">
          <div className="logo-container">
            <img src={logo} alt="Scrumble Logo" className="landing-logo" />
          </div>
          <h1 className="main-title">
            Welcome to <span className="highlight">Scrum<span className="highlight2">ble</span></span>
          </h1>
          <br />
          <p className="tagline">
            a scrum based project management plateform
            <br />
            for maximum efficiency and optimal results
          </p>
          <button className="cta-button" onClick={() => navigate("/auth")}>
            Get started!
            <span className="button-glow"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
