export const OIDC_PROVIDER = Symbol('OIDC_PROVIDER');
export const OIDC_OPTIONS = Symbol('OIDC_OPTIONS');
export const OIDC_ACCOUNT_SOURCE = Symbol('OIDC_ACCOUNT_SOURCE');

/** All provider endpoints live under this prefix (discovery stays at /.well-known). */
export const OIDC_ROUTE_PREFIX = '/oidc';

/**
 * Same path in the SPA and the backend: the provider scopes the `_interaction`
 * cookie to it, so the SPA must POST to `<issuer>/interaction/:uid/...`.
 */
export const INTERACTION_PATH = '/interaction';

export const OIDC_ROUTES = {
  authorization: `${OIDC_ROUTE_PREFIX}/auth`,
  token: `${OIDC_ROUTE_PREFIX}/token`,
  jwks: `${OIDC_ROUTE_PREFIX}/jwks`,
  userinfo: `${OIDC_ROUTE_PREFIX}/me`,
  end_session: `${OIDC_ROUTE_PREFIX}/session/end`,
  // Disabled features, prefixed anyway so nothing can ever land outside /oidc.
  revocation: `${OIDC_ROUTE_PREFIX}/token/revocation`,
  introspection: `${OIDC_ROUTE_PREFIX}/token/introspection`,
  registration: `${OIDC_ROUTE_PREFIX}/reg`,
  pushed_authorization_request: `${OIDC_ROUTE_PREFIX}/request`,
  device_authorization: `${OIDC_ROUTE_PREFIX}/device/auth`,
  code_verification: `${OIDC_ROUTE_PREFIX}/device`,
  backchannel_authentication: `${OIDC_ROUTE_PREFIX}/backchannel`,
  challenge: `${OIDC_ROUTE_PREFIX}/challenge`,
  credential: `${OIDC_ROUTE_PREFIX}/credential`,
} as const;
