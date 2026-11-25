import { safeReturnTo } from './return-to';

describe('safeReturnTo', () => {
  it('keeps internal relative paths', () => {
    expect(safeReturnTo('/interaction/abc')).toBe('/interaction/abc');
    expect(safeReturnTo('/organization?tab=1')).toBe('/organization?tab=1');
  });

  it.each([
    'https://evil.test',
    '//evil.test/x',
    '/\\evil.test',
    'javascript:alert(1)',
    '/javascript:alert(1)',
    'relative/path',
    '',
    undefined,
    null,
  ])('rejects %p', (value) => {
    expect(safeReturnTo(value as any, '/home')).toBe('/home');
  });
});
