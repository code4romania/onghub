export default class CreateOngRequestEvent {
  constructor(private _adminEmail: string, private _requestId: number) {}

  public get adminEmail() {
    return this._adminEmail;
  }

  public get requestId() {
    return this._requestId;
  }
}
