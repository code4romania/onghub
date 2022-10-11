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
  hubStatistics: IGeneralONGHubStatistics;
}

export interface IOrganizationRequestStatistics {
  labels: string[];
  approved: string[];
  declined: string[];
}

export interface IOrganizationStatusStatistics {
  labels: string[];
  active: string[];
  restricted: string[];
}

export interface IGeneralONGHubStatistics {
  numberOfActiveOrganizations: number;
  numberOfApplications: number;
}
