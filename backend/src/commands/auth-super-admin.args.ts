// Argument parsing for auth:super-admin, apart from the command so tests do not load AppModule.
export function parseArgs(argv: string[]): {
  add?: string;
  remove?: string;
  name?: string;
  phone?: string;
} {
  const known = ['--add', '--remove', '--name', '--phone'];
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 2) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (!known.includes(flag)) throw new Error(`Unknown argument ${flag}`);
    if (value === undefined || value.startsWith('--')) {
      throw new Error(`${flag} needs a value`);
    }
    out[flag.slice(2)] = value;
  }
  if (out.add && out.remove) throw new Error('--add or --remove, not both');
  if (out.add && !out.name) throw new Error('--add needs --name');
  return out;
}
