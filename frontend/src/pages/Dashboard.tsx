import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../services/api';
import type { UserProfile } from '../services/api';
import logo from "../assets/ScrumbleLogo2.png";
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate          = useNavigate();
  const { token, logout } = useAuth(); 
  const [user, setUser]   = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!token) { navigate('/auth'); return; }

    getMe(token)
      .then(setUser)
      .catch(() => {
        logout();
      });
  }, [token]);

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : '?';

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-logo">
          <div className="logo-placeholder"><img src={logo} alt="Logo" /></div>
          <span className="logo-text">Scrum<span>ble</span></span>
        </div>
        <button className="profile-btn" onClick={() => navigate('/profile')}>
          <div className="profile-avatar">{initials}</div>
          {user ? `${user.firstName} ${user.lastName}` : '…'}
        </button>
      </header>

      <main className="dashboard-main">
        {/* Dashboard content goes here */}
      </main>
    </div>
  );
};

export default Dashboard;