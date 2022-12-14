export default class DisableOngRequestEvent {
  constructor(private _organizationName: string) {}

  public get organizationName() {
    return this._organizationName;
  }
}
