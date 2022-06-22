import React, { useState } from 'react';
import './App.css';
import Router from './common/router/Router';
import { AuthContext } from './contexts/AuthContext';

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: true,
  });

  return (
    <AuthContext.Provider value={{ ...authState, setAuthState }}>
      <Router />
    </AuthContext.Provider>
  );
};

export default App;
