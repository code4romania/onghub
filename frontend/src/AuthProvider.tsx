import React from 'react';
import { Auth } from 'aws-amplify';
import { useState, useEffect } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { useUserQuery } from './services/user/User.queries';
import LoadingContent from './components/data-table/LoadingContent';
import { useNavigate } from 'react-router-dom';
import { useErrorToast } from './common/hooks/useToast';
import { UserStatus } from './pages/users/enums/UserStatus.enum';

const Loading = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <LoadingContent /> <span>Se incarca...</span>
    </div>
  );
};

const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
  });

  // Fetch the user after the Cognito call (enabled: false will prevent it from requesting it immediately)
  const { refetch: refetchUserProfile, error: fetchUserError } = useUserQuery({ enabled: false });

  const [isLoading, setIsLoading] = useState(true);

  const logout: any = async () => {
    await Auth.signOut();
    setAuthState({ isAuthenticated: false });
  };

  useEffect(() => {
    (async () => {
      try {
        await Auth.currentAuthenticatedUser();
        const {data: profile} = await refetchUserProfile();
        if (profile.status === UserStatus.ACTIVE){
          setAuthState({ isAuthenticated: true });
        } else {
          throw Error(); // TODO: Better error handling.
        }
      } catch (error) {
        logout();
      }
       finally {
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
    <AuthContext.Provider value={{ ...authState, setAuthState, logout }}>
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
