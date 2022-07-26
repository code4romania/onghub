import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import Router from './common/router/Router';
import { AuthContext } from './contexts/AuthContext';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { messages as messagesRo } from './assets/locales/ro/messages';
import { LocaleProvider } from './contexts/LocaleContext';
import { Amplify, Auth } from 'aws-amplify';
import { AMPLIFY_CONFIG } from './common/config/amplify.config';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// Configure Amplify for Login
Amplify.configure(AMPLIFY_CONFIG);

// Internationalization load
i18n.load({ ro: messagesRo });
i18n.activate('ro');

const queryClient = new QueryClient();

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
  });

  const logout: any = async () => {
    await Auth.signOut();
    setAuthState({ isAuthenticated: false });
  };

  useEffect(() => {
    (async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        // #TODO Get user from backend based on user.username (+ check status - deny access if disabled)
        // #TODO Set user in store
        setAuthState({ isAuthenticated: true });
        console.log(user);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, setAuthState, logout }}>
      <QueryClientProvider client={queryClient}>
        <LocaleProvider>
          <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
            <ToastContainer
              position={toast.POSITION.TOP_RIGHT}
              autoClose={30000}
              limit={3}
              closeOnClick
              rtl={false}
            />
            <Router />
          </I18nProvider>
        </LocaleProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
};

export default App;
