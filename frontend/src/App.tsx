import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landing from './pages/Landing';
import Verify from "./pages/Verify";
import Auth from "./pages/auth";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/auth" element={<Auth/>} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <ToastContainer
          position="top-right"
          autoClose={4000}
          theme="dark"
      />
    </>
  );
}
