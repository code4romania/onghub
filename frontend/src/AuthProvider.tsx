import React from 'react';
import { useState, useEffect } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { useProfileQuery } from './services/user/User.queries';
import { Loading } from './components/loading/Loading';
import { UserRole } from './pages/users/enums/UserRole.enum';
import {
  ORGANIZATION_ERRORS,
  RESTRICTED_USER_ERRORS,
  USER_ERRORS,
} from './common/constants/error.constants';
import { useErrorToast } from './common/hooks/useToast';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { ensureAccessToken, logout as ownLogout } from './services/auth/OwnAuth.service';
import useStore from './store/store';

// Captured once: logout puts the store back to this, so nothing from the
// previous user stays in memory.
const INITIAL_STORE = useStore.getState();

const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isRestricted: false,
    restrictedReason: '',
  });
  const [role, setRole] = useState<UserRole | null>(null);
  const { t } = useTranslation('user');

  // Fetched after the session is restored (enabled: false: not on mount)
  const { refetch: refetchUserProfile } = useProfileQuery({
    enabled: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const logout: any = async () => {
    try {
      await ownLogout();
      useStore.setState(INITIAL_STORE, true);
      queryClient.clear();
    } catch (err) {
      console.log(err);
    } finally {
      setAuthState({ isAuthenticated: false, isRestricted: false, restrictedReason: '' });
      setRole(null);
    }
  };

  /** Loads the session and profile; also called right after a login. */
  const reloadSession = async (): Promise<void> => {
    {
      try {
        // Silent refresh from the httpOnly cookie; no cookie = logged out.
        if (!(await ensureAccessToken())) return;
        const { data: profile, error } = await refetchUserProfile();
        if (!profile) throw error;

        setAuthState({
          isAuthenticated: true,
          isRestricted: false,
          restrictedReason: '',
        });
        setRole(profile?.role as UserRole);
      } catch (error: any) {
        const err = error?.response?.data;
        switch (err?.code) {
          case USER_ERRORS.RESTRICT:
          case ORGANIZATION_ERRORS.RESTRICT:
            setAuthState({
              ...authState,
              isRestricted: true,
              restrictedReason: RESTRICTED_USER_ERRORS[err?.code],
            });
            break;
          case USER_ERRORS.NOT_FOUND:
            useErrorToast(t('user.not_found'));
            logout();
            break;
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    reloadSession();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, role, setAuthState, logout, reloadSession }}>
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
