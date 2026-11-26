import { createPrivateKey, createPublicKey } from 'crypto';
import { generateKeys, toTfvars } from './oidc-generate-keys';

describe('oidc:generate-keys', () => {
  const keys = generateKeys('staging', new Date('2026-11-26T10:00:00Z'));

  it('makes values the backend accepts', () => {
    const pem = (b64: string) => Buffer.from(b64, 'base64').toString();
    expect(
      createPrivateKey(pem(keys.ngohub_jwt_private_key)).asymmetricKeyType,
    ).toBe('rsa');
    expect(
      createPublicKey(pem(keys.ngohub_jwt_public_key)).asymmetricKeyType,
    ).toBe('rsa');
    expect(Buffer.from(keys.ngohub_auth_token_key, 'base64')).toHaveLength(32);
    expect(keys.ngohub_jwt_key_id).toBe('ngohub-staging-2026-11');

    const jwks = JSON.parse(keys.ngohub_oidc_jwks);
    expect(jwks.keys).toHaveLength(1);
    expect(jwks.keys[0]).toMatchObject({
      kty: 'RSA',
      alg: 'RS256',
      use: 'sig',
      kid: 'ngohub-oidc-staging-2026-11',
    });
    expect(jwks.keys[0].d).toBeDefined(); // the provider signs with it
    expect(createPrivateKey({ key: jwks.keys[0], format: 'jwk' }).type).toBe(
      'private',
    );

    const cookies = JSON.parse(keys.ngohub_oidc_cookie_keys);
    expect(cookies).toHaveLength(1);
    expect(Buffer.from(cookies[0], 'base64url').length).toBe(32);
  });

  it('writes valid tfvars (JSON-quoted strings)', () => {
    const lines = toTfvars(keys).trim().split('\n');
    expect(lines).toHaveLength(6);
    for (const line of lines) {
      const value = line.slice(line.indexOf(' = ') + 3);
      expect(typeof JSON.parse(value)).toBe('string');
    }
  });

  it('gives different keys each time', () => {
    expect(generateKeys('staging').ngohub_auth_token_key).not.toBe(
      keys.ngohub_auth_token_key,
    );
  });
});
