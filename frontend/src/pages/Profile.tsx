import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getMe, resendVerification, updateMe } from '../services/api';
import logo from "../assets/ScrumbleLogo2.png";
import type { UserProfile } from '../services/api';
import './Profile.css';

const Profile: React.FC = () => {
  const navigate          = useNavigate();
  const { token, logout } = useAuth();
  const [user, setUser]           = useState<UserProfile | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  //Edit mode state 
  // editing: whether the form is open or not
  // editForm: the live values in the input fields while editing
  // saving: disables Save button while request is in flight
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", email: "" });

  useEffect(() => {
    if (!token) { navigate('/auth'); return; }

    getMe(token)
      .then(setUser)
      .catch((err: Error) => setError(err.message ?? 'Something went wrong'))
      .finally(() => setLoading(false));
  }, [token]);


  // Pre-fill the inputs with the current values so the user doesn't have to retype everything from scratch
  const handleEditClick = () => {
    if (!user) return;
    setEditForm({ firstName: user.firstName, lastName: user.lastName, email: user.email });
    setEditing(true);
  };

  // Cancel edit
  const handleCancel = () => {
    setEditing(false);
  };

  // Save changes
  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const updated = await updateMe(token, editForm);
      setUser(updated);         // update what's displayed on the page
      setEditing(false);        // close edit mode
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message ?? "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleResendVerification = async () => {
    if (!token) { navigate('/auth'); return; }
    setResending(true);
    try {
      const res = await resendVerification(token);
      toast.success(res.message ?? 'Verification email sent!');
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

                  {/* ── First Name ── */}
                  <div className="profile-info-row">
                    <span className="info-icon">👤</span>
                    <div className="info-content">
                      <span className="info-label">First Name</span>
                      {/* When editing: show an input. When not: show plain text. */}
                      {editing ? (
                        <input
                          className="profile-edit-input"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        />
                      ) : (
                        <span className="info-value">{user.firstName}</span>
                      )}
                    </div>
                  </div>

                  {/* ── Last Name ── */}
                  <div className="profile-info-row">
                    <span className="info-icon">👤</span>
                    <div className="info-content">
                      <span className="info-label">Last Name</span>
                      {editing ? (
                        <input
                          className="profile-edit-input"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        />
                      ) : (
                        <span className="info-value">{user.lastName}</span>
                      )}
                    </div>
                  </div>

                  {/* ── Email ── */}
                  <div className="profile-info-row">
                    <span className="info-icon">✉️</span>
                    <div className="info-content">
                      <span className="info-label">Email</span>
                      {editing ? (
                        <input
                          className="profile-edit-input"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      ) : (
                        <span className="info-value">{user.email}</span>
                      )}
                    </div>
                  </div>

                </div>

                {/*Edit / Save / Cancel buttons */}
                {!editing ? (
                  <button className="edit-profile-btn" onClick={handleEditClick}>
                    Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button className="cancel-btn" onClick={handleCancel} disabled={saving}>
                      Cancel
                    </button>
                  </div>
                )}
              </>
            )}

            {!loading && (
              <button className="logout-btn" onClick={logout}>
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