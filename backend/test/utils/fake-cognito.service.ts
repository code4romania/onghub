/**
 * Replaces CognitoUserService until O7 removes Cognito: no AWS call is ever
 * made from tests. Records the calls so specs can assert on them.
 */
export class FakeCognitoUserService {
  public readonly calls: { method: string; args: unknown[] }[] = [];
  private counter = 0;

  private record(method: string, args: unknown[]) {
    this.calls.push({ method, args });
  }

  async createUser(...args: unknown[]): Promise<string> {
    this.record('createUser', args);
    return `test-cognito-${++this.counter}`;
  }

  async deleteUser(...args: unknown[]): Promise<void> {
    this.record('deleteUser', args);
  }

  async resendInvite(...args: unknown[]): Promise<void> {
    this.record('resendInvite', args);
  }

  async globalSignOut(...args: unknown[]): Promise<void> {
    this.record('globalSignOut', args);
  }

  async updateUser(...args: unknown[]): Promise<void> {
    this.record('updateUser', args);
  }
}
