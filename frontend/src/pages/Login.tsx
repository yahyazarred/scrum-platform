import { useState } from "react";
import type { FormEvent } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await login({ email, password });

    if (res.token) {
  localStorage.setItem("token", res.token);
  navigate("/dashboard");
} else {
  alert(res.message);
}

  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
