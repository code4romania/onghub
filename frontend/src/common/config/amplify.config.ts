export const AMPLIFY_CONFIG = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID ?? '',
      userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID ?? '', // ONGHub
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        oauth: {
          domain: process.env.REACT_APP_COGNITO_OAUTH_DOMAIN ?? '',
          scopes: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
          redirectSignIn: [process.env.REACT_APP_FRONTEND_URL ?? ''],
          redirectSignOut: [process.env.REACT_APP_FRONTEND_URL ?? ''],
          responseType: 'code' as const,
        },
      }
    }
  },
};