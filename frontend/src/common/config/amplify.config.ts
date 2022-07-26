export const AMPLIFY_CONFIG = {
  Auth: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_TwmnT1UC2',
    userPoolWebClientId: '400vdublp0f6ln8ijerca34324',
  },
  oauth: {
    domain: 'onghub2.auth.eu-central-1.amazoncognito.com',
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
