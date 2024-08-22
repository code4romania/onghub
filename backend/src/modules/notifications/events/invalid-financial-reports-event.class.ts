export default class InvalidFinancialReportsEvent {
  constructor(private _email: string) {}

  public get email() {
    return this._email;
  }
}
