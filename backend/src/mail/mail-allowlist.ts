/**
 * MAIL_ALLOWLIST: comma-separated addresses or `*@domain` patterns. Unset =
 * every recipient allowed (today's behaviour). Meant for a rehearsal on a copy
 * of production data, so no real NGO gets an email.
 */
export function parseAllowlist(raw?: string): string[] | null {
  const entries = (raw ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return entries.length ? entries : null;
}

export function isAllowed(
  address: string,
  allowlist: string[] | null,
): boolean {
  if (!allowlist) return true;
  const email = (address ?? '').trim().toLowerCase();
  return allowlist.some((entry) =>
    entry.startsWith('*@') ? email.endsWith(entry.slice(1)) : email === entry,
  );
}

/** The recipients that may receive mail; [] when none. */
export function allowedRecipients(
  to: string | string[] | undefined,
  allowlist: string[] | null,
): string[] {
  const list = []
    .concat(to ?? [])
    .map((t: any) => (typeof t === 'string' ? t : t?.address));
  return list.filter((address) => address && isAllowed(address, allowlist));
}
