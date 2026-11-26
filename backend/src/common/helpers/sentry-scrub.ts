/**
 * Keeps login secrets out of Sentry (plan 5.6): links and codes, OIDC
 * authorization codes and state, tokens, cookies. Sentry gets URLs from
 * requests, breadcrumbs and transaction names, so each place is cleaned.
 */

const REDACTED = '[redacted]';

/** Query parameters that carry a secret or bind a login flow. */
const SECRET_PARAMS = new Set([
  'code',
  'state',
  'nonce',
  'token',
  'id_token_hint',
  'code_verifier',
  'code_challenge',
  'client_secret',
  'access_token',
  'refresh_token',
  'secret',
]);

/** Body fields never sent, whatever the route. */
const SECRET_FIELDS = new Set([
  ...SECRET_PARAMS,
  'password',
  'email',
  'assertion',
  'client_assertion',
]);

const SECRET_HEADERS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
]);

/** /auth/token/<secret>[/resend] carries the secret in the path. */
const SECRET_PATH = /(\/auth\/token\/)[^/?#\s]+/g;

export function scrubUrl(url: string): string {
  if (typeof url !== 'string' || !url) return url;
  const path = url.replace(SECRET_PATH, `$1${REDACTED}`);
  const [beforeHash, hash] = path.split('#', 2);
  const q = beforeHash.indexOf('?');
  const scrubbedHash = hash === undefined ? '' : `#${REDACTED}`;
  if (q < 0) return beforeHash + scrubbedHash;
  const params = beforeHash
    .slice(q + 1)
    .split('&')
    .map((pair) => {
      const [key] = pair.split('=', 1);
      return SECRET_PARAMS.has(decodeURIComponent(key).toLowerCase())
        ? `${key}=${REDACTED}`
        : pair;
    });
  return `${beforeHash.slice(0, q)}?${params.join('&')}${scrubbedHash}`;
}

function scrubObject(value: unknown, depth = 0): unknown {
  if (depth > 5 || value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((v) => scrubObject(v, depth + 1));
  const out: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(value)) {
    out[key] = SECRET_FIELDS.has(key.toLowerCase())
      ? REDACTED
      : scrubObject(v, depth + 1);
  }
  return out;
}

function scrubHeaders(headers?: Record<string, unknown>) {
  if (!headers) return headers;
  const out: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(headers)) {
    out[key] = SECRET_HEADERS.has(key.toLowerCase()) ? REDACTED : v;
  }
  return out;
}

// Loosely typed on purpose: the same function serves Sentry events and transactions.
export function scrubEvent<T>(original: T): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const event = original as any;
  if (!event) return original;
  if (typeof event.transaction === 'string') {
    event.transaction = scrubUrl(event.transaction);
  }
  const request = event.request;
  if (request) {
    if (request.url) request.url = scrubUrl(request.url);
    if (request.query_string !== undefined) {
      const qs =
        typeof request.query_string === 'string'
          ? request.query_string
          : new URLSearchParams(request.query_string).toString();
      request.query_string = scrubUrl(`?${qs}`).slice(1);
    }
    if (request.data !== undefined) {
      request.data =
        typeof request.data === 'string' ? REDACTED : scrubObject(request.data);
    }
    request.headers = scrubHeaders(request.headers);
    if (request.cookies) request.cookies = REDACTED;
  }
  for (const breadcrumb of event.breadcrumbs ?? []) {
    scrubBreadcrumb(breadcrumb);
  }
  for (const span of event.spans ?? []) {
    if (typeof span.description === 'string') {
      span.description = scrubUrl(span.description);
    }
    if (span.data?.url) span.data.url = scrubUrl(span.data.url);
    if (span.data?.['http.query']) span.data['http.query'] = REDACTED;
  }
  if (event.contexts?.trace?.data?.url) {
    event.contexts.trace.data.url = scrubUrl(event.contexts.trace.data.url);
  }
  return original;
}

export function scrubBreadcrumb<T>(original: T): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const crumb = original as any;
  if (!crumb) return original;
  if (typeof crumb.message === 'string') {
    crumb.message = scrubUrl(crumb.message);
  }
  if (crumb.data) {
    if (typeof crumb.data.url === 'string') {
      crumb.data.url = scrubUrl(crumb.data.url);
    }
    if (crumb.data['http.query']) crumb.data['http.query'] = REDACTED;
  }
  return original;
}
