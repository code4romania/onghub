import { Auth } from 'aws-amplify';
import { useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../contexts/AuthContext';
import { RESTRICTED_USER_ERRORS } from '../common/constants/error.constants';

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// This needs to stay outside the component because the AuthProvider is a parent of the interceptor and it's use effect and request for profile is done before the interceptors
// and the profile request needs the auth headers
API.interceptors.request.use(async (request) => {
  // add auth header with jwt if account is logged in and request is to the api url
  try {
    const user = await Auth.currentAuthenticatedUser();

    if (!request.headers) {
      request.headers = {};
    }

    if (user?.getSignInUserSession()) {
      request.headers.Authorization = `Bearer ${user
        .getSignInUserSession()
        .getAccessToken()
        .getJwtToken()}`;
    }
  } catch (err) {
    // User not authenticated. May be a public API.
    // Catches "The user is not authenticated".
    return request;
  }

  return request;
});

interface AxiosInterceptorProps {
  children: JSX.Element;
}

// Add this wrapper to be able access the authcontext inside response interceptor
// and also avoid using ''window.location'' for redirecting and destroy the SPA behavior of our application
const AxiosInterceptor = ({ children }: AxiosInterceptorProps) => {
  const { setAuthState } = useAuthContext();

  const responseInterceptor = API.interceptors.response.use(
    async (response) => {
      return response;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (error: any) => {
      // Redirect to login once we have restricted access
      if (error.response.status === 401) {
        await Auth.signOut();
        // set initial application state
        setAuthState({ isAuthenticated: false, isRestricted: false, restrictedReason: '' });
      }

      // If use doesn't have access to resource redirect to home
      if (error.response.status === 403) {
        // this will trigger the redirect to restricted page
        setAuthState({
          isAuthenticated: true,
          isRestricted: true,
          restrictedReason: RESTRICTED_USER_ERRORS[error?.response?.data?.code],
        });
      }

      // if not any of the auth error codes throw the error
      throw error;
    },
  );

  useEffect(() => {
    return () => {
      /**
       * we should eject previous interceptors in the clean up function, in case we do not
       * each time the useEffect is executed, the interceptor will be added to interceptors stack
       */
      return API.interceptors.response.eject(responseInterceptor);
    };
  }, []);
  return children;
};

export default API;
export { AxiosInterceptor };
