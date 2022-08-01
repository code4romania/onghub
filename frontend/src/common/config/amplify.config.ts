export const AMPLIFY_CONFIG = {
  Auth: {
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID, // ONGHub
  },
  oauth: {
    domain: process.env.REACT_APP_COGNITO_OAUTH_DOMAIN,
    scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    redirectSignIn: process.env.REACT_APP_FRONTEND_URL,
    redirectSignOut: process.env.REACT_APP_FRONTEND_URL,
    responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
  },
  // cookieStorage: {
  //   domain: 'localhost',
  //   secure: false,
  //   path: '/',
  //   expires: 365,
  // },
};
