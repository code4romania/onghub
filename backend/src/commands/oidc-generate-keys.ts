/**
 * Generates the secret values NGO Hub's own login and OIDC provider need, as
 * terraform variables for one environment (terraform-ngohub, T1):
 *
 *   npm run oidc:generate-keys -- --env staging --out ngohub-staging.auto.tfvars
 *
 * The file is written with mode 0600 and nothing secret goes to stdout. Keep it
 * out of git and out of chat; store it where the team keeps terraform secrets.
 *
 * OIDC signing keys (plan 5.1): two from the start. The provider signs with the
 * first; the second is published as the standby, so clients already know it
 * when it starts signing. Rotation, in two steps:
 *
 *   npm run oidc:generate-keys -- --env staging --rotate-oidc <jwks.json> --out <new-jwks.json>
 *       the standby signs next, a new standby is added, the old key stays third
 *       to verify the ID tokens it signed
 *   npm run oidc:generate-keys -- --trim-oidc <jwks.json> --out <new-jwks.json>
 *       after the ID token lifetime + clients' JWKS cache (a day is plenty):
 *       drop the old key
 *
 * The JSON files hold the value of ngohub_oidc_jwks (private keys): mode 0600.
 */
import { generateKeyPairSync, randomBytes } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';

export interface GeneratedKeys {
  ngohub_jwt_private_key: string;
  ngohub_jwt_public_key: string;
  ngohub_jwt_key_id: string;
  ngohub_auth_token_key: string;
  ngohub_oidc_jwks: string;
  ngohub_oidc_cookie_keys: string;
}

const rsa = () => generateKeyPairSync('rsa', { modulusLength: 2048 });

/** A private RS256 signing JWK for the provider. */
function oidcJwk(kid: string) {
  return {
    ...rsa().privateKey.export({ format: 'jwk' }),
    kid,
    alg: 'RS256',
    use: 'sig',
  };
}

export function generateKeys(env: string, now = new Date()): GeneratedKeys {
  const month = now.toISOString().slice(0, 7);

  const jwt = rsa();
  const pem = (key: string | Buffer) => Buffer.from(key).toString('base64');

  const signing = oidcJwk(`ngohub-oidc-${env}-${month}-a`);
  const standby = oidcJwk(`ngohub-oidc-${env}-${month}-b`);

  return {
    ngohub_jwt_private_key: pem(
      jwt.privateKey.export({ type: 'pkcs8', format: 'pem' }),
    ),
    ngohub_jwt_public_key: pem(
      jwt.publicKey.export({ type: 'spki', format: 'pem' }),
    ),
    ngohub_jwt_key_id: `ngohub-${env}-${month}`,
    ngohub_auth_token_key: randomBytes(32).toString('base64'),
    ngohub_oidc_jwks: JSON.stringify({ keys: [signing, standby] }),
    ngohub_oidc_cookie_keys: JSON.stringify([
      randomBytes(32).toString('base64url'),
    ]),
  };
}

function parseJwks(jwks: string): { keys: { kid: string }[] } {
  const parsed = JSON.parse(jwks);
  if (!Array.isArray(parsed?.keys))
    throw new Error('not a JWKS ({"keys":[...]})');
  return parsed;
}

/** Step 1: [signing, standby] -> [standby, new standby, old signing]. */
export function rotateOidcJwks(
  jwks: string,
  env: string,
  now = new Date(),
): string {
  const { keys } = parseJwks(jwks);
  if (keys.length < 2) throw new Error('no standby key to promote');
  if (keys.length > 2) throw new Error('trim the old key first (--trim-oidc)');
  const [signing, standby] = keys;
  const next = oidcJwk(`ngohub-oidc-${env}-${now.toISOString().slice(0, 10)}`);
  if (keys.some((k) => k.kid === next.kid)) {
    throw new Error(`a key ${next.kid} exists already`);
  }
  return JSON.stringify({ keys: [standby, next, signing] });
}

/** Step 2: drop the old signing key once nothing it signed is still valid. */
export function trimOidcJwks(jwks: string): string {
  const { keys } = parseJwks(jwks);
  return JSON.stringify({ keys: keys.slice(0, 2) });
}

export function toTfvars(keys: GeneratedKeys): string {
  return (
    Object.entries(keys)
      .map(([name, value]) => `${name} = ${JSON.stringify(value)}`)
      .join('\n') + '\n'
  );
}

function main() {
  const argv = process.argv.slice(2);
  const option = (name: string) => {
    const i = argv.indexOf(name);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const env = option('--env');
  const out = option('--out');
  if (!out) throw new Error('--out <file> is required');
  if (existsSync(out)) throw new Error(`${out} exists; not overwriting keys`);

  const trim = option('--trim-oidc');
  if (trim) {
    writeFileSync(out, trimOidcJwks(readFileSync(trim, 'utf8')), {
      mode: 0o600,
    });
    process.stdout.write(
      `wrote ${out} (mode 600): the JWKS without the old key\n`,
    );
    return;
  }
  if (!env || !/^[a-z0-9-]+$/.test(env))
    throw new Error('--env <name> is required');
  const rotate = option('--rotate-oidc');
  if (rotate) {
    writeFileSync(out, rotateOidcJwks(readFileSync(rotate, 'utf8'), env), {
      mode: 0o600,
    });
    process.stdout.write(
      `wrote ${out} (mode 600): the standby signs next, a new standby, the old key third\n`,
    );
    return;
  }

  writeFileSync(out, toTfvars(generateKeys(env)), { mode: 0o600 });
  process.stdout.write(
    `wrote ${out} (mode 600): ngohub_jwt_*, ngohub_auth_token_key, ngohub_oidc_jwks, ngohub_oidc_cookie_keys for ${env}\n`,
  );
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${(error as Error).message}\n`);
    process.exit(1);
  }
}
