import { createPrivateKey, createPublicKey } from 'crypto';
import {
  generateKeys,
  rotateOidcJwks,
  toTfvars,
  trimOidcJwks,
} from './oidc-generate-keys';

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

    // Plan 5.1: at least two keys; the provider signs with the first, the second is the published standby.
    const jwks = JSON.parse(keys.ngohub_oidc_jwks);
    expect(jwks.keys).toHaveLength(2);
    expect(jwks.keys.map((k) => k.kid)).toEqual([
      'ngohub-oidc-staging-2026-11-a',
      'ngohub-oidc-staging-2026-11-b',
    ]);
    expect(jwks.keys[0]).toMatchObject({
      kty: 'RSA',
      alg: 'RS256',
      use: 'sig',
    });
    expect(jwks.keys[0].n).not.toBe(jwks.keys[1].n);
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

  it('rotates: the standby signs next, a new standby is published, the old key stays to verify', () => {
    const before = JSON.parse(keys.ngohub_oidc_jwks).keys;
    const rotated = JSON.parse(
      rotateOidcJwks(
        keys.ngohub_oidc_jwks,
        'staging',
        new Date('2027-02-03T00:00:00Z'),
      ),
    ).keys;
    expect(rotated.map((k) => k.kid)).toEqual([
      'ngohub-oidc-staging-2026-11-b',
      'ngohub-oidc-staging-2027-02-03',
      'ngohub-oidc-staging-2026-11-a',
    ]);
    expect(rotated[0].n).toBe(before[1].n);
    expect(rotated[2].n).toBe(before[0].n);
    expect(createPrivateKey({ key: rotated[1], format: 'jwk' }).type).toBe(
      'private',
    );

    const trimmed = JSON.parse(
      trimOidcJwks(JSON.stringify({ keys: rotated })),
    ).keys;
    expect(trimmed.map((k) => k.kid)).toEqual([
      'ngohub-oidc-staging-2026-11-b',
      'ngohub-oidc-staging-2027-02-03',
    ]);
  });

  it('refuses to rotate a key set without a standby, or with a leftover old key', () => {
    const one = JSON.stringify({
      keys: [JSON.parse(keys.ngohub_oidc_jwks).keys[0]],
    });
    expect(() => rotateOidcJwks(one, 'staging')).toThrow(/standby/);
    const three = rotateOidcJwks(keys.ngohub_oidc_jwks, 'staging');
    expect(() => rotateOidcJwks(three, 'staging')).toThrow(/trim/);
  });
});
