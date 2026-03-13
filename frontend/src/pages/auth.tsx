import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGooglePlusG,
  faFacebookF,
  faGithub,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { signup, login } from "../services/api";
import "./auth.css";


// ================== Interfaces ==================
interface SignupForm {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  password: string;
}
interface LoginForm {
  email: string;
  password: string;
}

// ================== Main Component ==================

const Auth: React.FC = () => {
  const navigate = useNavigate();
  // false = show login
  // true = show signup
  const [isActive, setIsActive] = useState<boolean>(false);

  // ================== State: Signup Form ==================

  //store all signup form inputs in one object
  const [signupForm, setSignupForm] = useState<SignupForm>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    password: "",
  });

  // ================== State: Login Form ==================

  //store login form inputs
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  // ================== Toggle Functions ==================

  // Switch UI to SIGNUP mode
  const handleRegisterClick = () => {
    setIsActive(true);
  };

  // Switch UI to LOGIN mode
  const handleLoginClick = () => {
    setIsActive(false);
  };

  const [showPassword, setShowPassword] = useState(false);

  // ================== Input Handlers ==================

  // When user types in signup inputs
  // It updates the correct field dynamically
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm({
      ...signupForm, // keep existing values
      [e.target.name]: e.target.value, // update the field that changed
    });
  };

  // Same logic but for login inputs
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
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

      // Save token and user data in localStorage
      localStorage.setItem("token", res.token!);
      localStorage.setItem("userStatus", res.status!);
      localStorage.setItem("userName", `${res.firstName} ${res.lastName}`);

      console.log("Token:", res.token);

      // Show success message
     toast.success(res.message || "Login successful!");

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during login. Please try again.",
      );
    }
  };

  return (
    // container class changes when isActive changes
    <div className={`container ${isActive ? "active" : ""}`} id="container">
      {/* ================= SIGN UP PANEL ================= */}
      <div className="form-container sign-up">
        <FontAwesomeIcon
    icon={faArrowLeft}
    className="back-icon"
    onClick={() => navigate("/")}
    style={{
      cursor: "pointer",
      fontSize: "1.5rem",
      position: "absolute",  // <-- key change
      top: "20px",           // distance from top
      left: "20px",          // distance from left
      zIndex: 10,            // ensures it’s above other elements
    }}
  />

        <form onSubmit={handleSignUpSubmit}>
          <h1>Create Account</h1>

          {/* Social icons section */}
          <div className="social-icons">
            <a href="#" className="icon">
              <FontAwesomeIcon icon={faGooglePlusG} />
            </a>
            <a href="#" className="icon">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" className="icon">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="#" className="icon">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>

          <span>or use your email for registration</span>

          <div className="name-container">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={signupForm.firstName}
              onChange={handleSignupChange}
              required
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={signupForm.lastName}
              onChange={handleSignupChange}
              required
            />
          </div>
          <input
            type="date"
            name="dateOfBirth"
            value={signupForm.dateOfBirth}
            onChange={handleSignupChange}
            required
            max={
              new Date(
                new Date().getFullYear() - 15,
                new Date().getMonth(),
                new Date().getDate(),
              )
                .toISOString()
                .split("T")[0]
            }
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signupForm.email}
            onChange={handleSignupChange}
            required
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={signupForm.password}
              onChange={handleSignupChange}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash } />
            </button>
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
    style={{
      cursor: "pointer",
      fontSize: "1.5rem",
      position: "absolute",  // <-- key change
      top: "20px",           // distance from top
      left: "20px",          // distance from left
      zIndex: 10,            // ensures it’s above other elements
    }}
  />

        <form onSubmit={handleSignInSubmit}>
          <h1>Login</h1>

          <div className="social-icons">
            <a href="#" className="icon">
              <FontAwesomeIcon icon={faGooglePlusG} />
            </a>
            <a href="#" className="icon">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" className="icon">
              <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="#" className="icon">
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </div>

          <span>or use your email and password</span>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={handleLoginChange}
            required
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={handleLoginChange}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </button>
          </div>

          <a href="#">Forget Your Password?</a>

          <button type="submit">Login</button>
        </form>
      </div>

      {/* ================= TOGGLE SECTION ================= */}
      {/* This is the sliding animation section */}
      <div className="toggle-container">
        <div className="toggle">
          {/* Left panel (login view) */}
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="hidden" onClick={handleLoginClick} type="button">
              Login
            </button>
          </div>

          {/* Right panel (signup view) */}
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Don't have an account yet?</p>
            <button
              className="hidden"
              onClick={handleRegisterClick}
              type="button"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
