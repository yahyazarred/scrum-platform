// ============================================================
// What is this file?
//   Creates a global "auth state" that any component can read.
//
// What it holds:
//   - token        → the JWT string, or null if not logged in
//   - login(token) → call this after login/verify to save the token
//   - logout()     → call this to clear the token and go to /auth
//
// How it works:
//   1. AuthProvider wraps the whole app (see App.tsx)
//   2. It holds the token in React state, initialised from localStorage
//      so refreshing the page doesn't log the user out
//   3. Any component calls useAuth() to read the token or call login/logout
// ============================================================

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// ======= Shape of what the context exposes =======
interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// ====== Create the context (null = not yet provided) =======
const AuthContext = createContext<AuthContextType | null>(null);

// ======== Provider component =========
// Wrap your app with this so every child can access auth state.
export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  // Initialise from localStorage so a page refresh keeps the user logged in
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  // Called after a successful login or email verification
  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // Called when the user logs out from anywhere in the app
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── useAuth hook ──────────────────────────────────────────────
// This is what your components will call:
//   const { token, login, logout } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}