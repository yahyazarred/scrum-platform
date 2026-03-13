import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyEmail } from "../services/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import './Verify.css';


// ================= Type Definition =================

// Defines the shape of the state passed through navigation
// Example: navigate('/verify', { state: { email: "test@email.com" } })
interface LocationState {
  email: string;
}


// ================= Component =================

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  // Stores the user's email
  const [email, setEmail] = useState<string>("");

  // Stores the verification code entered by user
  const [code, setCode] = useState<string>("");
  useEffect(() => {

    // If email was passed from previous page
    if (state?.email) {
      setEmail(state.email); // store it in state
    } else {
      // If no email exists, user shouldn't be here
      // Redirect them to signup page
      navigate("/signup");
    }

  }, [state, navigate]);


  // ================= Submit Handler =================

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await verifyEmail({ email, code });
toast.success(res.message);
// Save token like login does
localStorage.setItem("token", res.token!);
localStorage.setItem("userStatus", res.status!);
localStorage.setItem("userName", `${res.firstName} ${res.lastName}`);

navigate("/dashboard"); // ← go straight to dashboard
    
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.message);
    }
  };


  // ================= UI =================

  return (
    <div className="verify-wrapper">

      <div className="verify-container">

        {/* Icon section */}
        <div className="verify-icon-wrapper">
          <div className="verify-icon">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>
        </div>

        <h1>Verify Your Email</h1>

        {/* Display email that code was sent to */}
        <p className="verify-description">
          We've sent a verification code to <strong>{email}</strong>
        </p>

        {/* Verification form */}
        <form onSubmit={handleSubmit} className="verify-form">

          

          {/* Code input with icon */}
          <div className="input-group">
            <FontAwesomeIcon icon={faKey} className="input-icon" />

            <input
              type="text"
              placeholder="Enter Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)} // update state
              required
              className="verify-input"
            />
          </div>

          {/* Submit button */}
          <button type="submit" className="verify-button">
            Verify Email
          </button>

          {/* Footer section */}
          <div className="verify-footer">
            <p>Didn't receive the code?</p>
            <a href="#" className="resend-link">Resend Code</a>
          </div>

        </form>
      </div>
    </div>
  );
}
