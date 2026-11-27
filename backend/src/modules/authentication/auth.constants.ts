const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** How long an emailed secret stays valid. */
export const AUTH_TOKEN_TTL_MS = {
  LOGIN: 15 * MINUTE_MS, // link and code alike
  INVITE: 30 * DAY_MS, // invitations and the migration's transition link
  VERIFY_EMAIL: 24 * HOUR_MS,
};

/** A wrong code counts an attempt; the fifth ends the code. */
export const AUTH_CODE_MAX_ATTEMPTS = 5;

/** A refresh token presented again within this window after rotation is two tabs crossing, not a replay. */
export const REFRESH_REUSE_GRACE_MS = 10 * 1000;
