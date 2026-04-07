// ============================================================
//   1. AuthProvider wraps everything so all pages have auth access
//   2. Protected routes (/dashboard, /profile) are wrapped with
//      ProtectedRoute — no more manual token checks in those pages
// ============================================================

import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';

import Landing   from './pages/Landing';
import Auth      from './pages/auth';
import Verify    from './pages/Verify';
import Dashboard from './pages/Dashboard';
import Profile   from './pages/Profile';
import ProjectDashboard from './pages/ProjectDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes — anyone can visit these */}
        <Route path="/"      element={<Landing />} />
        <Route path="/auth"  element={<Auth />} />
        <Route path="/verify" element={<Verify />} />

        {/* Protected routes — redirects to /auth if no token */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        {/* Project View — Dynamic route passing state (project name & role) for rendering without redundant fetches */}
        <Route path="/project/:projectId" element={
          <ProtectedRoute><ProjectDashboard /></ProtectedRoute>
        } />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={4000}
        theme="dark"
      />
    </AuthProvider>
  );
}