export default class RejectOngRequestEvent {
  constructor(private _adminEmail: string) {}

  public get adminEmail() {
    return this._adminEmail;
  }
}
