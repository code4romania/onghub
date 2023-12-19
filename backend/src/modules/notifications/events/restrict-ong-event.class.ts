export default class RestrictOngEvent {
  constructor(private _organizationId: number) {}

  public get organizationId() {
    return this._organizationId;
  }
}
