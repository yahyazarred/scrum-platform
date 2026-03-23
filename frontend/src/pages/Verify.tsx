// ============================================================
// pages/Verify.tsx
//
// Fix vs old version:
//   - Redirects to '/auth' (not '/signup' which doesn't exist)
// ============================================================

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
      // FIX: was '/signup' which doesn't exist — correct route is '/auth'
      navigate("/auth");
    }
  }, [state, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await verifyEmail({ email, code });

      toast.success(res.message);

      // Save everything from the response just like login does
      localStorage.setItem("token", res.token!);
      localStorage.setItem("userStatus", res.status!);
      localStorage.setItem("userName", `${res.firstName} ${res.lastName}`);

      navigate("/dashboard");
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.message);
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