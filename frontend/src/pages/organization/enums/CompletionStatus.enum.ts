export enum CompletionStatus { // TODO: to remove, deprecated in favor of OrganizationFinancialReportStatus or keep it around for general purpose
  COMPLETED = 'Completed',
  NOT_COMPLETED = 'Not Completed',
}

/**
 *
 * 1. not_completed - financial reports exist, but no data has been added.
 * 2. pending - financial reports exist, admin filled in some information, but ANAF information is not yet ready.
 * 3. completed - financial reports exist, admin filled in and it checks out against ANAF information.
 * 4. invalid - financial reports exist, admin filled in but it does not check out against ANAF information.
 *
 * @export
 * @enum {number}
 */
export enum OrganizationFinancialReportStatus {
  NOT_COMPLETED = 'Not Completed',
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  INVALID = 'Invalid',
}
