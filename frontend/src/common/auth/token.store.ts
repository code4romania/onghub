/**
 * The access token lives in memory only (never localStorage); the refresh
 * token is an httpOnly cookie the browser sends to /auth/web/refresh.
 */
let accessToken: string | null = null;
let expiresAt = 0;

/** Refresh a little before the real expiry. */
const SKEW_MS = 30_000;

export const tokenStore = {
  get(): string | null {
    return accessToken && Date.now() < expiresAt - SKEW_MS ? accessToken : null;
  },
  set(token: string, expiresInSeconds: number): void {
    accessToken = token;
    expiresAt = Date.now() + expiresInSeconds * 1000;
  },
  clear(): void {
    accessToken = null;
    expiresAt = 0;
  },
};
