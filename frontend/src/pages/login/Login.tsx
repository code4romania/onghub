import React, { useEffect, useState } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';

const SMS_MFA = ({ onSubmit }: any) => {
  const submitSMS = () => {
    const sms = document.getElementById('sms') as HTMLInputElement;
    onSubmit(sms.value);
  };

  return (
    // <form className="space-y-6">
    <div>
      <label htmlFor="sms" className="block text-sm font-medium text-gray-700">
        sms
      </label>
      <div className="mt-1">
        <input
          id="sms"
          name="SMS"
          type="sms"
          autoComplete="current-sms"
          required
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <button
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={(e) => submitSMS()}
        >
          Confirm code
        </button>
      </div>
    </div>
    // </form>
  );
};

const CONFIRM_NEW_PASS_MFA = ({ onSubmit }: any) => {
  const submit = () => {
    const pass = document.getElementById('password') as HTMLInputElement;
    onSubmit(pass.value);
  };

  return (
    // <form className="space-y-6">
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
        New Password
      </label>
      <div className="mt-1">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <button
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={(e) => submit()}
        >
          Confirm
        </button>
      </div>
    </div>
    // </form>
  );
};

const Login = () => {
  const [user, setUser] = useState<CognitoUser>();

  useEffect(() => {
    (async () => {
      try {
        const currentSession = await Auth.currentSession();
        const currentAuthUser = await Auth.currentAuthenticatedUser();
        const currentUserInfo = await Auth.currentUserInfo();

        console.log(currentSession);
        console.log(currentAuthUser);
        console.log(currentUserInfo);

        setSignInUserSession(currentSession);
      } catch (err) {
        setSignInUserSession(undefined);
      }
    })();
  }, [user]);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          console.log('Authenticated...');
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
    // console.log(user, code, mfaType);
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
      console.log(username.value, password.value);
      const user = await Auth.signIn(username?.value, password?.value);
      console.log(user);
      setUser(user);
    } catch (error) {
      console.log('error signing in', error);
    }
  }

  async function logout() {
    await Auth.signOut();
    setUser(undefined);
  }

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            start your 14-day free trial
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {user && user?.challengeName === 'SMS_MFA' && !signInUserSession && (
            <SMS_MFA onSubmit={(code: any) => confirmSignInSMS(user, code, 'SMS_MFA')} />
          )}

          {user && user?.challengeName === 'NEW_PASSWORD_REQUIRED' && !signInUserSession && (
            <CONFIRM_NEW_PASS_MFA
              onSubmit={(password: any) => confirmNewPassword(user, password)}
            />
          )}

          {!user && !signInUserSession && (
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => signIn()}
                >
                  Sign in
                </button>
              </div>
              <button
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={(e) => Auth.federatedSignIn()}
              >
                Sign in HostedUI
              </button>
            </div>
          )}

          {signInUserSession && (
            <button
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={(e) => logout()}
            >
              Logout
            </button>
          )}

          {signInUserSession && `IM LOGGED IN WITH TOKEN`}
        </div>
      </div>
    </div>
  );
};

export default Login;
