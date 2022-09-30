import React from 'react';
import { Auth } from 'aws-amplify';
import { useState, useEffect } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { useProfileQuery } from './services/user/User.queries';
import { UserStatus } from './pages/users/enums/UserStatus.enum';
import { Loading } from './components/loading/Loading';
import { UserRole } from './pages/users/enums/UserRole.enum';

const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isRestricted: false,
    isOrganizationRestricted: false,
  });
  const [role, setRole] = useState<UserRole | null>(null);

  // Fetch the user after the Cognito call (enabled: false will prevent it from requesting it immediately)
  const { refetch: refetchUserProfile, error: fetchUserError } = useProfileQuery({
    enabled: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  const logout: any = async () => {
    await Auth.signOut();
    setAuthState({ isAuthenticated: false, isRestricted: false, isOrganizationRestricted: false });
    setRole(null);
  };

  useEffect(() => {
    (async () => {
      try {
        await Auth.currentAuthenticatedUser();
        const { data: profile } = await refetchUserProfile();
        if (profile?.status === UserStatus.ACTIVE) {
          setAuthState({
            ...authState,
            isAuthenticated: true,
          });
          setRole(profile?.role as UserRole);
        } else {
          setAuthState({ ...authState, isRestricted: true });
        }
      } catch (error) {
        logout();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (fetchUserError) {
      logout();
    }
  }, [fetchUserError]);

  return (
    <AuthContext.Provider value={{ ...authState, role, setAuthState, logout }}>
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
