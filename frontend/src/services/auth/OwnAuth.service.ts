import axios from 'axios';
import { OIDC_ISSUER_URL } from '../../common/auth/auth-mode';
import { tokenStore } from '../../common/auth/token.store';

/** Separate client: cookies included, no auth interceptors (avoids refresh loops). */
const AuthAPI = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const IssuerAPI = axios.create({
  baseURL: OIDC_ISSUER_URL,
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

interface SessionResponse {
  accessToken: string;
  expiresIn: number;
}

const keep = (session: SessionResponse): string => {
  tokenStore.set(session.accessToken, session.expiresIn);
  return session.accessToken;
};

export const requestLogin = async (email: string): Promise<{ maskedEmail: string }> =>
  (await AuthAPI.post('/auth/web/login/request', { email })).data;

export const loginWithCode = async (email: string, code: string): Promise<string> =>
  keep((await AuthAPI.post('/auth/login-code', { email, code })).data);

export const loginWithLink = async (token: string): Promise<string> =>
  keep((await AuthAPI.post('/auth/login-link', { token })).data);

export const getTokenInfo = async (
  secret: string,
): Promise<{ type: 'login' | 'invite'; maskedEmail: string }> =>
  (await AuthAPI.get(`/auth/token/${encodeURIComponent(secret)}`)).data;

export const resendToken = async (secret: string): Promise<void> => {
  await AuthAPI.post(`/auth/token/${encodeURIComponent(secret)}/resend`);
};

let refreshing: Promise<string | null> | null = null;

/** Single flight: parallel 401s share one refresh. null when there is no session. */
export const refreshSession = (): Promise<string | null> => {
  if (!refreshing) {
    refreshing = AuthAPI.post('/auth/web/refresh')
      .then((res) => keep(res.data))
      .catch(() => {
        tokenStore.clear();
        return null;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
};

/** A valid access token, refreshing when needed; null when logged out. */
export const ensureAccessToken = async (): Promise<string | null> =>
  tokenStore.get() ?? refreshSession();

/** Ends the NGO Hub session and the browser's OIDC session on the issuer. */
export const logout = async (): Promise<void> => {
  tokenStore.clear();
  await Promise.allSettled([
    AuthAPI.post('/auth/web/logout'),
    IssuerAPI.post('/interaction/session/end', {}),
  ]);
};

// OIDC interaction (the SPA side of "Continue with NGO Hub")

export interface InteractionDetails {
  prompt: string;
  client: { name: string; logo?: string };
  scopes: string[];
}

export const getInteraction = async (uid: string): Promise<InteractionDetails> =>
  (await IssuerAPI.get(`/interaction/${encodeURIComponent(uid)}`)).data;

export const finishInteraction = async (
  uid: string,
  accessToken: string,
): Promise<{ redirectTo: string; denied?: string }> =>
  (
    await IssuerAPI.post(
      `/interaction/${encodeURIComponent(uid)}/login`,
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
  ).data;

export const abortInteraction = async (uid: string): Promise<{ redirectTo: string }> =>
  (await IssuerAPI.post(`/interaction/${encodeURIComponent(uid)}/abort`, {})).data;
