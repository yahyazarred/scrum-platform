import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import Login from "./pages/Login";
import Auth from "./pages/auth";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/auth" element={<Auth/>} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
