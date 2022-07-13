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

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure({
  Auth: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_hS6RnIQoy',
    userPoolWebClientId: '2kqd38unhilekb94g0853uheme',
  },
});

i18n.load({
  ro: messagesRo,
});
i18n.activate('ro');

const queryClient = new QueryClient();

const App = ({ signOut, user }: any) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: true,
  });

  useEffect(() => {
    console.log(user);
  });

  return (
    <AuthContext.Provider value={{ ...authState, setAuthState }}>
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

export default withAuthenticator(App, {
  loginMechanisms: ['username'],
  signUpAttributes: ['email', 'phone_number'],
  variation: 'modal',
  hideSignUp: true,
});
