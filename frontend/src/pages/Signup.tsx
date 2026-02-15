import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/api";
import "./Signup.css";

interface SignupForm {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  password: string;
}

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState<SignupForm>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await signup(form);
    alert(res.message);
    navigate("/verify", { state: { email: form.email } });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="name-row">
            <input
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              required
            />
          </div>

          <input
            name="dateOfBirth"
            type="date"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
