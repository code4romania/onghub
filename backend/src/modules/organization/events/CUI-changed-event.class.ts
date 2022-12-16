/**
 *  Use Case: During the Request review of an NGO, the CUI can be updated by the SuperAdmin
 *            This change will impact the financial information requested from ANAF during the request creation.
 *
 *  Handler: The FinancialInformationService will respond to the event by removing the old data and replacing it with the new one from ANAF
 */
export default class CUIChangedEvent {
  constructor(private _organizationId: number, private _newCUI: string) {}

  public get organizationId() {
    return this._organizationId;
  }

  public get newCUI() {
    return this._newCUI;
  }
}
