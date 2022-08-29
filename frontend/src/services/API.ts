import { Auth } from 'aws-amplify';
import axios from 'axios';

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

API.interceptors.response.use(
  async (response) => {
    return response;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (error: any) => {
    // Redirect to login once we have restricted access
    if (error.response.status === 403) {
      await Auth.signOut();
      window.location.href = '/login';
    }

    return error;
  },
);

export default API;
