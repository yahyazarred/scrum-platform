// ============================================================
// pages/Dashboard.tsx
//
// Fix vs old version:
//   - Removed the dead JWT decode block (it decoded token but
//     then ignored the result and hardcoded initials = 'U')
//   - Now reads userName from localStorage (set at login/verify)
//     and builds real initials from it
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/ScrumbleLogo2.png";
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // userName is saved to localStorage at login and at email verification
  const userName = localStorage.getItem('userName') ?? '';

  // Build initials from "First Last" → "FL"
  const initials = userName
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase() || '?';

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-logo">
          <div className="logo-placeholder"><img src={logo} alt="Logo" /></div>
          <span className="logo-text">Scrum<span>ble</span></span>
        </div>

        <button className="profile-btn" onClick={() => navigate('/profile')}>
          <div className="profile-avatar">{initials}</div>
          {userName || 'My Profile'}
        </button>
      </header>

      <main className="dashboard-main">
        {/* Dashboard content goes here */}
      </main>
    </div>
  );
};

export default Dashboard;