import React, { useEffect, useState } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import { useAuthContext } from '../../contexts/AuthContext';

const Login = () => {
  const [user, setUser] = useState<CognitoUser>();
  const { setAuthState } = useAuthContext();

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user && !user?.challengeName) {
      console.log(user);
      setAuthState({ isAuthenticated: true });
    } else {
      console.log('CHALLANGE');
    }
  }, [user]);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      console.log('Auth Event', event);
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

  const [signInUserSession, setSignInUserSession] = useState<any>(null);

  async function confirmSignInSMS(user: any, code: any, mfaType: any) {
    const userAuth: CognitoUser = await Auth.confirmSignIn(user, code, mfaType);
    console.log(userAuth);
    const session = userAuth.getSignInUserSession();
    setSignInUserSession(session);
  }

  async function confirmNewPassword(user: any, password: any) {
    // console.log(user, code, mfaType);
    const userAuth: CognitoUser = await Auth.completeNewPassword(user, password);
    console.log(userAuth);
    const session = userAuth.getSignInUserSession();
    setSignInUserSession(session);
  }

  async function signIn() {
    try {
      const username = document.getElementById('email') as HTMLInputElement;
      const password = document.getElementById('password') as HTMLInputElement;
      const user = await Auth.signIn(username?.value, password?.value);
      setUser(user);
    } catch (error) {
      console.log('error signing in', error);
    }
  }

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <button
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={(e) => Auth.federatedSignIn()}
          >
            Sign in HostedUI
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
