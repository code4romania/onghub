import { allowedRecipients, isAllowed, parseAllowlist } from './mail-allowlist';

describe('MAIL_ALLOWLIST', () => {
  it('unset allows everyone', () => {
    expect(parseAllowlist(undefined)).toBeNull();
    expect(isAllowed('anyone@ngo.ro', null)).toBe(true);
  });

  it('exact addresses and *@domain patterns, case-insensitive', () => {
    const list = parseAllowlist(' qa@code4.ro , *@test.ngohub.ro ');
    expect(isAllowed('QA@code4.ro', list)).toBe(true);
    expect(isAllowed('x@test.ngohub.ro', list)).toBe(true);
    expect(isAllowed('x@evil-test.ngohub.ro.com', list)).toBe(false);
    expect(isAllowed('real@ngo.ro', list)).toBe(false);
    expect(allowedRecipients(['real@ngo.ro', 'qa@code4.ro'], list)).toEqual([
      'qa@code4.ro',
    ]);
  });
});
