/**
 * Generates the secret values NGO Hub's own login and OIDC provider need, as
 * terraform variables for one environment (terraform-ngohub, T1):
 *
 *   npm run oidc:generate-keys -- --env staging --out ngohub-staging.auto.tfvars
 *
 * The file is written with mode 0600 and nothing secret goes to stdout. Keep it
 * out of git and out of chat; store it where the team keeps terraform secrets.
 */
import { generateKeyPairSync, randomBytes } from 'crypto';
import { existsSync, writeFileSync } from 'fs';

export interface GeneratedKeys {
  ngohub_jwt_private_key: string;
  ngohub_jwt_public_key: string;
  ngohub_jwt_key_id: string;
  ngohub_auth_token_key: string;
  ngohub_oidc_jwks: string;
  ngohub_oidc_cookie_keys: string;
}

export function generateKeys(env: string, now = new Date()): GeneratedKeys {
  const month = now.toISOString().slice(0, 7);
  const rsa = () => generateKeyPairSync('rsa', { modulusLength: 2048 });

  const jwt = rsa();
  const pem = (key: string | Buffer) => Buffer.from(key).toString('base64');

  const oidc = rsa();
  const jwk = {
    ...oidc.privateKey.export({ format: 'jwk' }),
    kid: `ngohub-oidc-${env}-${month}`,
    alg: 'RS256',
    use: 'sig',
  };

  return {
    ngohub_jwt_private_key: pem(
      jwt.privateKey.export({ type: 'pkcs8', format: 'pem' }),
    ),
    ngohub_jwt_public_key: pem(
      jwt.publicKey.export({ type: 'spki', format: 'pem' }),
    ),
    ngohub_jwt_key_id: `ngohub-${env}-${month}`,
    ngohub_auth_token_key: randomBytes(32).toString('base64'),
    ngohub_oidc_jwks: JSON.stringify({ keys: [jwk] }),
    ngohub_oidc_cookie_keys: JSON.stringify([
      randomBytes(32).toString('base64url'),
    ]),
  };
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
  if (!env || !/^[a-z0-9-]+$/.test(env))
    throw new Error('--env <name> is required');
  if (!out) throw new Error('--out <file> is required');
  if (existsSync(out)) throw new Error(`${out} exists; not overwriting keys`);

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
