import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');
  const userStatus = localStorage.getItem('userStatus');

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Dashboard</h1>
        
        <p className="dashboard-welcome">
          Welcome back, <strong>{userName}</strong>!
        </p>

        <div className="dashboard-info">
          <p>
            <strong>Status:</strong>{' '}
            <span className={`status-badge ${userStatus !== 'verified' ? 'pending' : ''}`}>
              {userStatus}
            </span>
          </p>
          
          <p className="token-display">
            <strong>Token:</strong>
            <code className="token-code">{token}</code>
          </p>
        </div>

        <button 
          className="logout-button"
          onClick={() => {
            localStorage.clear();
            window.location.href = '/auth';
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;