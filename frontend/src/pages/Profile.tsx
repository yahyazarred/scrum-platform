// ============================================================
// pages/Profile.tsx
// ============================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMe, resendVerification } from '../services/api';
import logo from "../assets/ScrumbleLogo2.png";
import type { UserProfile } from '../services/api';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser]       = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  // Tracks whether the resend button is mid-request so we can disable it
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth'); return; }

    getMe(token)
      .then(setUser)
      .catch((err: Error) => setError(err.message ?? 'Something went wrong'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  // Called when the user clicks "Verify Account"
  const handleResendVerification = async () => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/auth'); return; }

    setResending(true);
    try {
      const res = await resendVerification(token);
      toast.success(res.message ?? 'Verification email sent!');

      // Navigate to /verify with the email pre-filled
      // (same flow as after signup — Verify.tsx reads location.state.email)
      navigate('/verify', { state: { email: res.email } });
    } catch (err: any) {
      toast.error(err.message ?? 'Could not send verification email');
    } finally {
      setResending(false);
    }
  };

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : '?';

  const isUnverified = user?.status === 'AWAITING_EMAIL_VERIFICATION';

  return (
    <div className="profile-wrapper">
      <header className="profile-header">
        <div className="header-logo">
          <div className="logo-placeholder"><img src={logo} alt="Logo" /></div>
          <span className="logo-text">Scrum<span>ble</span></span>
        </div>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </header>

      <main className="profile-main">
        <div className="profile-card">
          <div className="profile-banner">
            <div className="profile-avatar-large">
              {loading ? '?' : initials}
            </div>
          </div>

          <div className="profile-body">
            {loading && <p className="profile-loading">Loading your profile…</p>}
            {error   && <p className="profile-error">⚠ {error}</p>}

            {!loading && !error && user && (
              <>
                <h2 className="profile-name">{user.firstName} {user.lastName}</h2>

                <span className={`profile-status-badge ${isUnverified ? 'pending' : 'verified'}`}>
                  <span className="status-dot" />
                  {user.status}
                </span>

                {/* ── Verify account banner ── */}
                {/* Only shown when status is AWAITING_EMAIL_VERIFICATION */}
                {isUnverified && (
                  <div className="verify-banner">
                    <p className="verify-banner-text">
                      Your email address has not been verified yet.
                      Verify it to unlock all features.
                    </p>
                    <button
                      className="verify-account-btn"
                      onClick={handleResendVerification}
                      disabled={resending}
                    >
                      {resending ? 'Sending…' : 'Verify Account'}
                    </button>
                  </div>
                )}

                <div className="profile-info-section">
                  <div className="profile-info-row">
                    <span className="info-icon">👤</span>
                    <div className="info-content">
                      <span className="info-label">First Name</span>
                      <span className="info-value">{user.firstName}</span>
                    </div>
                  </div>
                  <div className="profile-info-row">
                    <span className="info-icon">👤</span>
                    <div className="info-content">
                      <span className="info-label">Last Name</span>
                      <span className="info-value">{user.lastName}</span>
                    </div>
                  </div>
                  <div className="profile-info-row">
                    <span className="info-icon">✉️</span>
                    <div className="info-content">
                      <span className="info-label">Email</span>
                      <span className="info-value">{user.email}</span>
                    </div>
                  </div>
                  <div className="profile-info-row">
                    <span className="info-icon">🔒</span>
                    <div className="info-content">
                      <span className="info-label">Account Status</span>
                      <span className="info-value">{user.status}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!loading && (
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;