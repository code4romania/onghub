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

/** Minimal static page (no scripts, no external resources). */
const page = (title: string, body: string) =>
  `<!DOCTYPE html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>` +
  '<style>body{font-family:system-ui,sans-serif;max-width:28rem;margin:4rem auto;padding:0 1rem}button{display:block;width:100%;margin:.5rem 0;padding:.6rem;font-size:1rem}</style>' +
  `</head><body><h1>${title}</h1>${body}</body></html>`;
const DAY = 24 * 60 * MINUTE;

/** Scopes a client may ever get. */
export const SUPPORTED_SCOPES = ['openid', 'email', 'profile', 'organization'];

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
      rpInitiatedLogout: {
        enabled: true,
        // The library's pages rely on an inline script our CSP blocks, and
        // show its own wording: a plain form with a button instead.
        async logoutSource(ctx, form) {
          ctx.type = 'html';
          ctx.body = page(
            'Deconectare',
            `<p>Vrei să te deconectezi din NGO Hub?</p>${form}` +
              '<button autofocus type="submit" form="op.logoutForm" value="yes" name="logout">Da, deconectează-mă</button>' +
              '<button type="submit" form="op.logoutForm">Nu</button>',
          );
        },
        async postLogoutSuccessSource(ctx) {
          ctx.type = 'html';
          ctx.body = page(
            'Deconectat',
            '<p>Te-ai deconectat din NGO Hub. Poți închide această pagină.</p>',
          );
        },
      },
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
      organization: ['organization'],
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
        // Read live, no cache. The library filters by granted scope; the
        // organization (with a presigned logo URL) is only built when granted.
        async claims(_use: string, scope: string) {
          const withOrganization = scope?.split(' ').includes('organization');
          const organization =
            withOrganization && accounts.organizationClaim
              ? await accounts.organizationClaim(String(account.id))
              : undefined;
          return {
            sub: String(account.id),
            email: account.email,
            email_verified: account.emailVerified,
            name: account.name,
            ...(organization ? { organization } : {}),
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
  provider.use(withoutFormActionLimit);
  return provider;
}

/**
 * helmet's `form-action 'self'` also limits where a form POST may be
 * redirected (Chrome enforces it), and the library's auto-submitted forms
 * (ending another account's session when someone else logs in, the
 * no-session logout) are followed by redirects to the client's registered
 * redirect URI. On the provider's own responses only, that directive goes;
 * the rest of the policy (script hashes included) stays.
 */
export async function withoutFormActionLimit(
  ctx: {
    response: { get(name: string): string };
    set(name: string, value: string): void;
  },
  next: () => Promise<unknown>,
): Promise<void> {
  await next();
  const csp = ctx.response.get('Content-Security-Policy');
  if (csp && /form-action/i.test(csp)) {
    ctx.set(
      'Content-Security-Policy',
      csp
        .split(';')
        .filter((directive) => !/^\s*form-action\b/i.test(directive))
        .join(';'),
    );
  }
}
