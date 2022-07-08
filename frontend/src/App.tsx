import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import Router from './common/router/Router';
import { AuthContext } from './contexts/AuthContext';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { messages as messagesRo } from './assets/locales/ro/messages';
import { LocaleProvider } from './contexts/LocaleContext';

i18n.load({
  ro: messagesRo,
});
i18n.activate('ro');

const queryClient = new QueryClient();

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: true,
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

export default App;
