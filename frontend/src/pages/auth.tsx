import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { signup, login } from "../services/auth.api";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/ScrumbleLogo2.png";
import "./auth.css";

interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
interface LoginForm {
  email: string;
  password: string;
}

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login: loginToContext } = useAuth();

  // false = show login, true = show signup
  const [isActive, setIsActive] = useState<boolean>(false);

  // ================== State: Signup Form ==================
  const [signupForm, setSignupForm] = useState<SignupForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // ================== State: Login Form ==================
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  // ================== Toggle Functions ==================
  const handleRegisterClick = () => setIsActive(true);
  const handleLoginClick    = () => setIsActive(false);

  const [showPassword, setShowPassword] = useState(false);

  // ================== Input Handlers ==================
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  // ================== Submit: Signup ==================
  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await signup(signupForm);
      toast.success(res.message);
      navigate("/verify", { state: { email: signupForm.email } });
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message);
    }
  };

  // ================== Submit: Login ==================
 const handleSignInSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const res = await login(loginForm);

    // loginToContext() saves to localStorage AND updates context state
    loginToContext(res.token!);

    toast.success(res.message || "Login successful!");
    navigate("/dashboard");
  } catch (error: any) {
    console.error("Login error:", error);
    toast.error(error.message);
  }
};

  return (
    <div className="auth-wrapper">
      <div className={`container ${isActive ? "active" : ""}`} id="container">
        {/* ================= SIGN UP PANEL ================= */}
      <div className="form-container sign-up">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="back-icon"
          onClick={() => navigate("/")}
        />

        <form onSubmit={handleSignUpSubmit}>
          <h1>Create Account</h1>

          <span>Create an account to access the <br />
            platform and start managing your projects</span>

          <div className="name-container">
            <input type="text" name="firstName" placeholder="First Name"
              value={signupForm.firstName} onChange={handleSignupChange} required />
            <input type="text" name="lastName" placeholder="Last Name"
              value={signupForm.lastName} onChange={handleSignupChange} required />
          </div>

          <input type="email" name="email" placeholder="Email"
            value={signupForm.email} onChange={handleSignupChange} required />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"} name="password" placeholder="Password"
              value={signupForm.password} onChange={handleSignupChange} required />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* ================= LOGIN PANEL ================= */}
      <div className="form-container sign-in">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="back-icon"
          onClick={() => navigate("/")}
        />

        <form onSubmit={handleSignInSubmit}>
          <h1>Login</h1>

          <span>Welcome back! Please log in <br />
            to access your account</span>

          <input type="email" name="email" placeholder="Email"
            value={loginForm.email} onChange={handleLoginChange} required />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"} name="password" placeholder="Password"
              value={loginForm.password} onChange={handleLoginChange} required />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <button type="submit">Login</button>
        </form>
      </div>

      {/* ================= TOGGLE SECTION ================= */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <img src={logo} alt="Scrumble Logo" className="landing-logo" />
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="hidden" onClick={handleLoginClick} type="button">Login</button>
          </div>
          <div className="toggle-panel toggle-right">
            <img src={logo} alt="Scrumble Logo" className="landing-logo" />
            <h1>Hello, Friend!</h1>
            <p>Don't have an account yet?</p>
            <button className="hidden" onClick={handleRegisterClick} type="button">Sign Up</button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Auth;