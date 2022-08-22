import React, { useEffect } from 'react';
import { Hub } from 'aws-amplify';
import Header from '../../components/Header/Header';

const Login = () => {
  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          console.log('Authenticated...', data);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Error', data);
          break;
        // case 'signIn':
        //   console.log('user signed in');
        //   break;
        case 'signUp':
          console.log('user signed up');
          break;
        case 'signOut':
          console.log('user signed out');
          break;
        // case 'signIn_failure':
        //   console.log('user sign in failed');
        //   break;
        case 'tokenRefresh':
          console.log('token refresh succeeded');
          break;
        case 'tokenRefresh_failure':
          console.log('token refresh failed');
          break;
        case 'configured':
          console.log('the Auth module is configured');
      }
    });
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-l from-yellow-500 to-yellow-800 w-screen h-screen"></div>
    </>
  );
};

export default Login;
