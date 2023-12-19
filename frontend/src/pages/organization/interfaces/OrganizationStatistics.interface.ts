export interface IAllOrganizationsStatistics {
  numberOfActiveOrganizations: number;
  numberOfUpdatedOrganizations: number;
  numberOfPendingRequests: number;
  numberOfUsers: number;
  meanNumberOfUsers: number;
  numberOfApps: number;
}

export interface IOrganizationStatistics {
  isOrganizationUpdated: boolean;
  organizationCreatedOn: Date;
  organizationSyncedOn: Date;
  numberOfInstalledApps: number;
  numberOfUsers: number;
  hubStatistics: IGeneralONGHubStatistics
}

export interface IGeneralONGHubStatistics {
  numberOfActiveOrganizations: number;
  numberOfApplications: number;
}