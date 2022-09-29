import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

function AuthGuard({ children }: any) {
  const auth = useAuthContext();
  const location = useLocation();

  if (auth.isRestricted) {
    return <Navigate to="/restricted" state={{ from: location }} replace />;
  }

  if (auth.isOrganizationRestricted) {
    return <Navigate to="/restricted-organization" state={{ from: location }} replace />;
  }

  if (!auth.isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default AuthGuard;
