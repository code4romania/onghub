import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import Router from './common/router/Router';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { messages as messagesRo } from './assets/locales/ro/messages';
import { LocaleProvider } from './contexts/LocaleContext';
import { Amplify } from 'aws-amplify';
import { AMPLIFY_CONFIG } from './common/config/amplify.config';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from './AuthProvider';

// Configure Amplify for Login
Amplify.configure(AMPLIFY_CONFIG);

// Internationalization load
i18n.load({ ro: messagesRo });
i18n.activate('ro');

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
