export default class DeleteAppRequest {
  constructor(
    private _organizationId: number,
    private _applicationName: string,
  ) {}

  public get organizationId() {
    return this._organizationId;
  }

  public get applicationName() {
    return this._applicationName;
  }
}
