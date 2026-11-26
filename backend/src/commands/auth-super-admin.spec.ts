import { parseArgs } from './auth-super-admin';

describe('auth:super-admin arguments', () => {
  it('lists without arguments, adds with a name, removes by email', () => {
    expect(parseArgs([])).toEqual({});
    expect(
      parseArgs(['--add', 'a@b.ro', '--name', 'Ana Pop', '--phone', '+40700']),
    ).toEqual({ add: 'a@b.ro', name: 'Ana Pop', phone: '+40700' });
    expect(parseArgs(['--remove', 'a@b.ro'])).toEqual({ remove: 'a@b.ro' });
  });

  it('refuses unknown flags, missing values, --add without --name, and both actions', () => {
    expect(() => parseArgs(['--delete', 'a@b.ro'])).toThrow(/Unknown/);
    expect(() => parseArgs(['--add'])).toThrow(/needs a value/);
    expect(() => parseArgs(['--add', '--name', 'x'])).toThrow(/needs a value/);
    expect(() => parseArgs(['--add', 'a@b.ro'])).toThrow(/--name/);
    expect(() =>
      parseArgs(['--add', 'a@b.ro', '--name', 'x', '--remove', 'c@d.ro']),
    ).toThrow(/not both/);
  });
});
