import { CookieOptions, Request, Response } from 'express';
import { SessionClient } from './services/session.service';

export const REFRESH_COOKIE = 'ngohub_refresh';
/** Binds an emailed code to the browser that asked for it (plan 5.2). */
export const LOGIN_NONCE_COOKIE = 'ngohub_login_nonce';

const secure = () => process.env.NODE_ENV !== 'local';

/** Only sent to /auth/web (refresh, logout). app.* and api.* share the registrable domain: Lax is enough. */
const refreshOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: secure(),
  sameSite: 'lax',
  path: '/auth/web',
});

const nonceOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: secure(),
  sameSite: 'lax',
  path: '/auth',
});

export function setRefreshCookie(
  res: Response,
  secret: string,
  ttlDays: number,
): void {
  res.cookie(REFRESH_COOKIE, secret, {
    ...refreshOptions(),
    maxAge: ttlDays * 24 * 60 * 60 * 1000,
  });
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE, refreshOptions());
}

export function setLoginNonceCookie(res: Response, nonce: string): void {
  res.cookie(LOGIN_NONCE_COOKIE, nonce, {
    ...nonceOptions(),
    maxAge: 15 * 60 * 1000,
  });
}

export function clearLoginNonceCookie(res: Response): void {
  res.clearCookie(LOGIN_NONCE_COOKIE, nonceOptions());
}

/** Stored on the session row. req.ip honours `trust proxy`. */
export function requestClient(req: Request): SessionClient {
  return { userAgent: req.headers['user-agent']?.slice(0, 512), ip: req.ip };
}
