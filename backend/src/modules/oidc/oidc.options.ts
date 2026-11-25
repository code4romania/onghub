import { generateKeyPairSync, randomBytes, randomUUID } from 'node:crypto';
import type { ClientMetadata, JWK } from 'oidc-provider';

export interface OidcOptions {
  /** e.g. https://id.ngohub.ro (no trailing slash). */
  issuer: string;
  /** SPA base for interactions, e.g. https://app.ngohub.ro/interaction */
  interactionUrl: string;
  /** Only serve provider routes for this Host header (issuer host). Unset = any host (local dev). */
  issuerHost?: string;
  jwks: { keys: JWK[] };
  cookieKeys: string[];
  /** Spike only: static clients. O10 replaces this with the oidc_client table adapter. */
  clients: ClientMetadata[];
}

const isProduction = () => process.env.NODE_ENV === 'production';

function ephemeralSigningKey(): JWK {
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  return {
    ...(privateKey.export({ format: 'jwk' }) as JWK),
    kid: randomUUID(),
    alg: 'RS256',
    use: 'sig',
  };
}

function parseJson<T>(name: string): T | undefined {
  const raw = process.env[name];
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`${name} is not valid JSON`);
  }
}

/**
 * Reads OIDC settings from the environment. Returns `undefined` when
 * OIDC_ISSUER is not set: the feature is off and nothing is mounted.
 */
export function oidcOptionsFromEnv(): OidcOptions | undefined {
  const issuer = process.env.OIDC_ISSUER?.replace(/\/$/, '');
  if (!issuer) return undefined;

  const interactionUrl = process.env.OIDC_INTERACTION_URL?.replace(/\/$/, '');
  if (!interactionUrl) {
    // Without our own interaction URL the library would fall back to its
    // dev screen, which signs in ANY account id. Refuse to start.
    throw new Error('OIDC_INTERACTION_URL is required when OIDC_ISSUER is set');
  }

  let jwks = parseJson<{ keys: JWK[] }>('OIDC_JWKS');
  let cookieKeys = parseJson<string[]>('OIDC_COOKIE_KEYS');

  if (!jwks?.keys?.length || !cookieKeys?.length) {
    if (isProduction()) {
      throw new Error(
        'OIDC_JWKS and OIDC_COOKIE_KEYS are required in production',
      );
    }
    jwks = jwks?.keys?.length ? jwks : { keys: [ephemeralSigningKey()] };
    cookieKeys = cookieKeys?.length
      ? cookieKeys
      : [randomBytes(32).toString('base64url')];
  }

  return {
    issuer,
    interactionUrl,
    issuerHost: process.env.OIDC_ISSUER_HOST || undefined,
    jwks,
    cookieKeys,
    clients: parseJson<ClientMetadata[]>('OIDC_STATIC_CLIENTS') ?? [],
  };
}
