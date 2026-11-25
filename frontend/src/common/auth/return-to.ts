/**
 * Only internal, relative paths: "/interaction/abc", "/organization".
 * Rejects absolute URLs, protocol-relative "//evil.com", backslashes and
 * anything with a scheme, so a crafted link cannot send the user elsewhere.
 */
const hasControlCharacters = (value: string): boolean =>
  Array.from(value).some((c) => c.charCodeAt(0) < 0x20 || c.charCodeAt(0) === 0x7f);

export function safeReturnTo(value: string | null | undefined, fallback = '/'): string {
  if (!value || typeof value !== 'string') return fallback;
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback;
  if (/^\/[^/]*:/.test(value) || hasControlCharacters(value)) return fallback;
  return value;
}
