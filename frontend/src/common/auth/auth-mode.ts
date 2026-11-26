/** The OIDC issuer (id.ngohub.ro); locally the API itself. */
export const OIDC_ISSUER_URL = (
  process.env.REACT_APP_OIDC_ISSUER ||
  process.env.REACT_APP_API_URL ||
  ''
).replace(/\/+$/, '');
