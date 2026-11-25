/**
 * Own passwordless login (link + 6-digit code) instead of Cognito/Amplify.
 * Off unless REACT_APP_OWN_AUTH=true, so this build behaves as before until
 * the per-environment cutover (the backend must have own auth enabled too).
 */
export const OWN_AUTH = process.env.REACT_APP_OWN_AUTH === 'true';

/** The OIDC issuer (id.ngohub.ro); locally the API itself. */
export const OIDC_ISSUER_URL = (
  process.env.REACT_APP_OIDC_ISSUER ||
  process.env.REACT_APP_API_URL ||
  ''
).replace(/\/+$/, '');
