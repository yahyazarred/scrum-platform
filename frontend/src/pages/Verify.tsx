import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import './Verify.css';

interface LocationState {
  email: string;
}

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState;
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    if (state?.email) {
      setEmail(state.email);
    } else {
      navigate("/signup");
    }
  }, [state, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await verifyEmail({ email, code });
      alert(res.message);
      navigate("/auth");
    } catch (error) {
      console.error('Verification error:', error);
      alert('An error occurred during verification. Please try again.');
    }
  };

  return (
    <div className="verify-wrapper">
      <div className="verify-container">
        <div className="verify-icon-wrapper">
          <div className="verify-icon">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
        </div>

        <h1>Verify Your Email</h1>
        <p className="verify-description">
          We've sent a verification code to <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="verify-form">
          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input 
              type="email"
              value={email} 
              disabled 
              className="verify-input disabled"
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faKey} className="input-icon" />
            <input
              type="text"
              placeholder="Enter Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="verify-input"
            />
          </div>

          <button type="submit" className="verify-button">
            Verify Email
          </button>

          <div className="verify-footer">
            <p>Didn't receive the code?</p>
            <a href="#" className="resend-link">Resend Code</a>
          </div>
        </form>
      </div>
    </div>
  );
}
