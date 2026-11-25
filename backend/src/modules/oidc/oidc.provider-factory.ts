import type {
  Configuration,
  KoaContextWithOIDC,
  Provider,
  interactionPolicy as InteractionPolicyNs,
} from 'oidc-provider';
import { loadOidcProvider, toProviderRealm } from './oidc-provider.loader';
import { OidcOptions } from './oidc.options';
import { OidcAccountSource } from './oidc-account-source.interface';
import { OIDC_ROUTES } from './oidc.constants';

const MINUTE = 60;
const DAY = 24 * 60 * MINUTE;

/** Scopes a client may ever get. `organization` arrives with O12. */
export const SUPPORTED_SCOPES = ['openid', 'email', 'profile'];

/**
 * Library default policy + one check: the library only re-prompts login when
 * the session has no accountId. When findAccount rejects the session's account
 * (user/organization no longer ACTIVE) we must ask for login again too,
 * otherwise the next /oidc/auth crashes in the consent prompt.
 */
export function buildInteractionPolicy(policyNs: typeof InteractionPolicyNs) {
  const { base, Check } = policyNs;
  const policy = base();
  policy
    .get('login')
    .checks.add(
      new Check(
        'account_unavailable',
        'the account can no longer sign in to client applications',
        (ctx) =>
          ctx.oidc.session.accountId && !ctx.oidc.account
            ? Check.REQUEST_PROMPT
            : Check.NO_NEED_TO_PROMPT,
      ),
    );
  return policy;
}

export function buildOidcConfiguration(
  options: OidcOptions,
  accounts: OidcAccountSource,
  policy: ReturnType<typeof buildInteractionPolicy>,
  adapter?: Configuration['adapter'],
): Configuration {
  const secureCookies = options.issuer.startsWith('https://');

  return {
    clients: options.clients ?? [],
    ...(adapter ? { adapter } : {}),
    jwks: options.jwks,

    // Our own SPA handles login. Never the library's dev screen.
    interactions: {
      policy,
      url: (_ctx, interaction) =>
        `${options.interactionUrl}/${interaction.uid}`,
    },

    features: {
      devInteractions: { enabled: false },
      registration: { enabled: false },
      introspection: { enabled: false },
      revocation: { enabled: false },
      deviceFlow: { enabled: false },
      clientCredentials: { enabled: false },
      claimsParameter: { enabled: false },
      resourceIndicators: { enabled: false },
      userinfo: { enabled: true },
      rpInitiatedLogout: { enabled: true },
    },

    routes: OIDC_ROUTES,

    responseTypes: ['code'],
    pkce: { required: () => true }, // v9 only supports S256
    issueRefreshToken: async () => false,
    allowOmittingSingleRegisteredRedirectUri: false,
    clientBasedCORS: () => false, // VIC exchanges the code server-side

    clientDefaults: {
      grant_types: ['authorization_code'],
      response_types: ['code'],
      token_endpoint_auth_method: 'client_secret_basic',
      id_token_signed_response_alg: 'RS256',
    },
    enabledJWA: {
      // Never HS*: the client secret would become a signing key.
      idTokenSigningAlgValues: ['RS256'],
      userinfoSigningAlgValues: ['RS256'],
    },
    extraClientMetadata: {
      properties: ['first_party'],
      validator(_ctx, key, value) {
        if (
          key === 'first_party' &&
          value !== undefined &&
          typeof value !== 'boolean'
        ) {
          throw new Error('first_party must be a boolean');
        }
      },
    },

    scopes: SUPPORTED_SCOPES,
    claims: {
      openid: ['sub'],
      email: ['email', 'email_verified'],
      profile: ['name'],
    },
    conformIdTokenClaims: true, // ID token carries only `sub`; the rest via /oidc/me

    ttl: {
      Interaction: 10 * MINUTE,
      AuthorizationCode: 60,
      IdToken: 10 * MINUTE,
      AccessToken: 10 * MINUTE,
      Session: 7 * DAY,
      Grant: 7 * DAY,
    },

    cookies: {
      keys: options.cookieKeys,
      long: {
        httpOnly: true,
        sameSite: 'lax',
        secure: secureCookies,
        signed: true,
      },
      short: {
        httpOnly: true,
        sameSite: 'lax',
        secure: secureCookies,
        signed: true,
      },
    },

    // Runs on every /oidc/auth (incl. existing sessions) and on /oidc/me:
    // a restricted user or organization is cut off on the next request.
    async findAccount(_ctx, sub) {
      const account = await accounts.findActive(sub);
      if (!account) return undefined;
      return {
        accountId: String(account.id),
        async claims() {
          return {
            sub: String(account.id),
            email: account.email,
            email_verified: account.emailVerified,
            name: account.name,
          };
        },
      };
    },

    // First-party clients skip consent: grant exactly the requested scopes
    // (the library already dropped those not in the client's `scope`).
    async loadExistingGrant(ctx: KoaContextWithOIDC) {
      const { client, session, provider } = ctx.oidc;
      const grantId =
        ctx.oidc.result?.consent?.grantId ||
        session.grantIdFor(client.clientId);
      if (grantId) {
        return provider.Grant.find(grantId);
      }
      if (!client['first_party']) {
        return undefined;
      }
      const grant = new provider.Grant({
        clientId: client.clientId,
        accountId: session.accountId,
      });
      grant.addOIDCScope([...ctx.oidc.requestParamScopes].join(' '));
      await grant.save();
      return grant;
    },

    // Never echo request parameters back.
    async renderError(ctx, out) {
      ctx.type = 'application/json';
      ctx.body = { error: out.error };
    },
  };
}

export function createOidcProvider(
  options: OidcOptions,
  accounts: OidcAccountSource,
  adapter?: Configuration['adapter'],
): Provider {
  const { Provider, interactionPolicy } = loadOidcProvider();
  const policy = buildInteractionPolicy(interactionPolicy);
  const provider = new Provider(
    options.issuer,
    toProviderRealm(buildOidcConfiguration(options, accounts, policy, adapter)),
  );
  // Behind ALB (+ maybe CloudFront): trust X-Forwarded-*. Hop count confirmed in T0.
  provider.proxy = true;
  return provider;
}
