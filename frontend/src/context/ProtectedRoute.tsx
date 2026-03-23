// ============================================================
// What is this file?
//   A wrapper you put around any route that requires login.
//   replaces every manual token check inside each page.
// How it works:
//   - Reads the token from AuthContext
//   - If token exists  → renders the page normally
//   - If no token      → redirects to /auth immediately
// ============================================================

import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth();

  // No token → send to login, 
  // replacing current history entry (so pressing Back won't return them to the protected page)
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}