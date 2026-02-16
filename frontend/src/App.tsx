import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Verify from "./pages/Verify";
import Auth from "./pages/auth";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/auth" element={<Auth/>} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
