export interface IAllOrganizationsStatistics {
  numberOfActiveOrganizations: number;
  numberOfUpdatedOrganizations: number;
  numberOfPendingRequests: number;
  numberOfUsers: number;
  meanNumberOfUsers: number;
  numberOfApps: number;
}

export interface IOrganizationStatistics {
  organizationCreatedOn: Date;
  organizationSyncedOn: Date | null;
  numberOfInstalledApps: number;
  numberOfUsers: number;
  hubStatistics: IGeneralONGHubStatistics;
  numberOfErroredFinancialReports: number;
  numberOfErroredReportsInvestorsPartners: number;
}

export interface IGeneralONGHubStatistics {
  numberOfActiveOrganizations: number;
  numberOfApplications: number;
}
