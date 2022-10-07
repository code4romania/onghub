import { Injectable } from '@nestjs/common';
import { ApplicationService } from 'src/modules/application/services/application.service';
import { UserService } from 'src/modules/user/services/user.service';
import { OrganizationService } from '.';
import { OrganizationFinancialStatus } from '../enums/organization-financial-status.enum';
import { OrganizationStatus } from '../enums/organization-status.enum';
import { RequestStatus } from '../enums/request-status.enum';
import {
  IGeneralONGHubStatistics,
  IOrganizationStatistics,
  IAllOrganizationsStatistics,
} from '../interfaces/organization-statistics.interface';
import { OrganizationRequestService } from './organization-request.service';

@Injectable()
export class OrganizationStatisticsService {
  constructor(
    private readonly organizationsService: OrganizationService,
    private readonly applicationService: ApplicationService,
    private readonly userService: UserService,
    private readonly organizationRequestService: OrganizationRequestService,
  ) {}

  public async getAllOrganizationsStatistics(): Promise<IAllOrganizationsStatistics> {
    const numberOfActiveOrganizations =
      await this.organizationsService.countOrganizations({
        where: { status: OrganizationStatus.ACTIVE },
      });

    const numberOfUpdatedOrganizations =
      await this.organizationsService.countOrganizations({
        where: {
          status: OrganizationStatus.ACTIVE,
          financialStatus: OrganizationFinancialStatus.COMPLETED,
        },
      });

    const numberOfUsers = await this.userService.countUsers();

    const numberOfPendingRequests =
      await this.organizationRequestService.countOrganizationRequest({
        where: { status: RequestStatus.PENDING },
      });

    const numberOfApps = await this.applicationService.countApplications();

    return {
      numberOfActiveOrganizations,
      numberOfUpdatedOrganizations,
      numberOfPendingRequests,
      numberOfUsers,
      meanNumberOfUsers: Math.ceil(numberOfActiveOrganizations / numberOfUsers),
      numberOfApps,
    };
  }

  public async getOrganizationStatistics(
    organizationId: number,
  ): Promise<IOrganizationStatistics> {
    const organization = await this.organizationsService.find(organizationId);
    const installedApps = await this.applicationService.findApplicationsForOng(
      organizationId,
    );
    const numberOfUsers = await this.userService.countUsers({
      where: { organizationId },
    });

    return {
      isOrganizationUpdated:
        organization.financialStatus === OrganizationFinancialStatus.COMPLETED,
      organizationCreatedOn: organization.createdOn,
      organizationSyncedOn: organization.syncedOn,
      numberOfInstalledApps: installedApps.length,
      numberOfUsers,
      hubStatistics: await this.getGeneralONGHubStatistics(),
    };
  }

  private async getGeneralONGHubStatistics(): Promise<IGeneralONGHubStatistics> {
    const numberOfActiveOrganizations =
      await this.organizationsService.countOrganizations({
        where: { status: OrganizationStatus.ACTIVE },
      });
    const numberOfApplications =
      await this.applicationService.countApplications();

    return {
      numberOfActiveOrganizations,
      numberOfApplications,
    };
  }
}
