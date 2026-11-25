export default class ApproveOngRequestEvent {
  /**
   * `loginUrl`/`code`: the admin's first-login link and code, with own auth.
   * Absent with Cognito, which sends its own invitation.
   */
  constructor(
    private _adminEmail: string,
    private _loginUrl?: string,
    private _code?: string,
  ) {}

  public get adminEmail() {
    return this._adminEmail;
  }

  public get loginUrl() {
    return this._loginUrl;
  }

  public get code() {
    return this._code;
  }
}
