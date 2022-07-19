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

Amplify.configure({
  Auth: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_TwmnT1UC2',
    userPoolWebClientId: '400vdublp0f6ln8ijerca34324',
  },
  oauth: {
    domain: 'onghub2.auth.eu-central-1.amazoncognito.com',
    scope: ['email', 'profile', 'openid'],
    redirectSignIn: 'http://localhost:3000/',
    redirectSignOut: 'http://localhost:3000/',
    responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
  },
});

i18n.load({
  ro: messagesRo,
});
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
        setAuthState({ isAuthenticated: true });
        console.log(user);
      } catch (error) {
        console.log(error);
        // setAuthState({ isAuthenticated: false });
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, setAuthState, logout }}>
      <QueryClientProvider client={queryClient}>
        <LocaleProvider>
          <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
            <Router />
          </I18nProvider>
        </LocaleProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
};

export default App;
