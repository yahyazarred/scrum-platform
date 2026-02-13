import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/api";

interface LocationState {
  email: string;
}

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState; // get email from signup page
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    if (state?.email) {
      setEmail(state.email);
    } else {
      // if someone lands here directly without email, redirect to signup
      navigate("/signup");
    }
  }, [state, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await verifyEmail({ email, code });
    alert(res.message);
    // navigate("/login"); // uncomment when login page exists
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Verify Email</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          {/* Show email but disabled so user cannot change */}
          <input value={email} disabled />

          <input
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <button type="submit">Verify</button>
        </form>
      </div>
    </div>
  );
}
