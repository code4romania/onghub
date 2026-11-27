import { generateKeyPairSync, randomBytes } from 'crypto';

/** Throwaway keys, made in memory for one test run. Nothing secret is ever committed for tests. */
export function generateTestAuthKeys(): Record<string, string> {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    publicKeyEncoding: { type: 'spki', format: 'pem' },
  });
  return {
    JWT_PRIVATE_KEY: Buffer.from(privateKey).toString('base64'),
    JWT_PUBLIC_KEY: Buffer.from(publicKey).toString('base64'),
    JWT_KEY_ID: 'test',
    AUTH_TOKEN_KEY: randomBytes(32).toString('base64'),
  };
}
