import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';
import Router from './common/router/Router';
import { I18nextProvider } from 'react-i18next';
import { LocaleProvider } from './contexts/LocaleContext';
import { Amplify } from 'aws-amplify';
import { AMPLIFY_CONFIG } from './common/config/amplify.config';
import { toast, ToastContainer } from 'react-toastify';
import i18n from './common/config/i18n';

import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from './AuthProvider';

// Configure Amplify for Login
Amplify.configure(AMPLIFY_CONFIG);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 0, // DEFAULT: 0 seconds 
      cacheTime: 300000, // DEFAULT: 5 minutes (300000 ms)
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: "always",
      suspense: false,
    }
  }
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocaleProvider>
          <I18nextProvider i18n={i18n}>
            <ToastContainer
              position={toast.POSITION.TOP_RIGHT}
              autoClose={30000}
              limit={3}
              closeOnClick
              rtl={false}
            />
            <Router />
          </I18nextProvider>
        </LocaleProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
