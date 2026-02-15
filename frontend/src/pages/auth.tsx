import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import { signup, login } from '../services/api';
import './auth.css';

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

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState<boolean>(false);

  // Sign up form state
  const [signupForm, setSignupForm] = useState<SignupForm>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
  });

  // Login form state
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  // Handle signup form changes
  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  // Handle login form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  // Handle sign up submission
  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await signup(signupForm);
      alert(res.message);
      navigate('/verify', { state: { email: signupForm.email } });
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup. Please try again.');
    }
  };

  // Handle sign in submission
  const handleSignInSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await login(loginForm);
      
      if (res.token) {
        localStorage.setItem('token', res.token);
        navigate('/dashboard');
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      <div className="form-container sign-up">
        <form onSubmit={handleSignUpSubmit}>
          <h1>Create Account</h1>
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
          <input 
            type="date"
            name="dateOfBirth"
            value={signupForm.dateOfBirth}
            onChange={handleSignupChange}
            required
          />
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            value={signupForm.email}
            onChange={handleSignupChange}
            required
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={signupForm.password}
            onChange={handleSignupChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div className="form-container sign-in">
        <form onSubmit={handleSignInSubmit}>
          <h1>Sign In</h1>
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
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={loginForm.password}
            onChange={handleLoginChange}
            required
          />
          <a href="#">Forget Your Password?</a>
          <button type="submit">Login</button>
        </form>
      </div>

      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button className="hidden" onClick={handleLoginClick} type="button">
              Login
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Don't have an account yet?</p>
            <button className="hidden" onClick={handleRegisterClick} type="button">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
