export default class ApproveOngRequestEvent {
  constructor(private _adminEmail: string) {}

  public get adminEmail() {
    return this._adminEmail;
  }
}
