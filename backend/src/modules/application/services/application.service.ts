import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ApplicationRepository } from '../repositories/application.repository';
import { Application } from '../entities/application.entity';
import {
  APPLICATION_ERRORS,
  ONG_APPLICATION_ERRORS,
  USER_ONG_APPLICATION_ERRORS,
} from '../constants/application-error.constants';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';
import { Pagination } from 'src/common/interfaces/pagination';
import { APPLICATION_ONG_FILTERS_CONFIG } from '../constants/application-filters.config';
import { ApplicationWithOngStatus } from '../interfaces/application-with-ong-status.interface';
import { ORGANIZATION_ALL_APPS_COLUMNS } from '../constants/application.constants';
import { OngApplicationService } from './ong-application.service';
import { OngApplicationStatus } from '../enums/ong-application-status.enum';
import { ApplicationAccess } from '../interfaces/application-access.interface';
import { ApplicationStatus } from '../enums/application-status.enum';
import { FileManagerService } from 'src/shared/services/file-manager.service';
import { ApplicationOngView } from '../entities/application-ong-view.entity';
import { ApplicationOngViewRepository } from '../repositories/application-ong-view.repository';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { OrganizationService } from 'src/modules/organization/services';
import { FindManyOptions } from 'typeorm';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import { UserStatus } from 'src/modules/user/enums/user-status.enum';
import { UserOngApplicationService } from './user-ong-application.service';
import { UserOngApplicationStatus } from '../enums/user-ong-application-status.enum';
import { USER_ERRORS } from 'src/modules/user/constants/user-error.constants';
import { ORGANIZATION_ERRORS } from 'src/modules/organization/constants/errors.constants';
import { ApplicationPullingType } from '../enums/application-pulling-type.enum';
import { OngApplicationRepository } from '../repositories/ong-application.repository';

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly applicationOngViewRepository: ApplicationOngViewRepository,
    private readonly ongApplicationService: OngApplicationService,
    private readonly ongApplicationRepository: OngApplicationRepository,
    private readonly fileManagerService: FileManagerService,
  ) {}

  // public async findOrganizationAplications(
  //   user: User,
  //   filters: OrganizationApplicationFilterDto,
  // ): Promise<ApplicationWithOngStatus[] | ApplicationAccess[]> {
  //   const { status } = filters;

  //   // ADMIN Handling
  //   if (user.role === Role.ADMIN) {
  //     // ALL active applications assigned to an ONG available to be assigned to a user
  //     if (status === ApplicationStatus.ACTIVE) {
  //       return this.findApplicationsForOngWithAccessStatus(user.organizationId);
  //     } else {
  //       // return all ONG application with ong status
  //       return this.findApplicationsForOng(user.organizationId);
  //     }
  //   }

  //   // USER Handling
  //   if (user.role === Role.EMPLOYEE) {
  //     return this.findApplicationsForOngEmployee(user.organizationId, user.id);
  //   }
  // }

  /**
   * @description
   * Toate applicatiile unui ong in cu statusul de access al unui utilzator
   */
  public async findActiveApplicationsForOngUserWithAccessStatus(
    organizationId: number,
    userId: number,
  ): Promise<ApplicationAccess[]> {
    const applications = await this.applicationRepository
      .getQueryBuilder()
      .select([
        'ongApp.id as id',
        'application.logo as logo',
        'application.name as name',
        'userOngApp.status as status',
        'application.type as type',
      ])
      .leftJoin(
        'ong_application',
        'ongApp',
        'ongApp.applicationId = application.id',
      )
      .leftJoin(
        'user_ong_application',
        'userOngApp',
        'userOngApp.ongApplicationId = ongApp.id and userOngApp.userId = :userId',
        { userId },
      )
      .where('ongApp.organizationId = :organizationId', { organizationId })
      .andWhere('ongApp.status = :status', {
        status: OngApplicationStatus.ACTIVE,
      })
      .andWhere('application.status = :status', {
        status: ApplicationStatus.ACTIVE,
      })
      .execute();

    return this.fileManagerService.mapLogoToEntity<ApplicationAccess>(
      applications,
    );
  }

  /**
   * @description
   * Metoda destinata utilizatorilor de tip employee ce intoarce o lista cu
   * aplicatiile la care acesta are access
   */
  public async findApplicationsForOngEmployee(
    organizationId: number,
    userId: number,
  ): Promise<ApplicationWithOngStatus[]> {
    // 1. Get all aplications for ONG
    const applications = await this.applicationRepository
      .getQueryBuilder()
      .select(ORGANIZATION_ALL_APPS_COLUMNS)
      .leftJoin(
        'ong_application',
        'ongApp',
        'ongApp.applicationId = application.id',
      )
      .leftJoin(
        'user_ong_application',
        'userOngApp',
        'userOngApp.ongApplicationId = ongApp.id',
      )
      .where('ongApp.organizationId = :organizationId', { organizationId })
      .andWhere('userOngApp.userId = :userId', { userId })
      .orWhere('application.type = :type', {
        type: ApplicationTypeEnum.INDEPENDENT,
      })
      .execute();

    return this.fileManagerService.mapLogoToEntity<ApplicationWithOngStatus>(
      applications,
    );
  }

  public async findOrganizationsByApplicationId(
    applicationId: number,
    options: BaseFilterDto,
  ): Promise<Pagination<ApplicationOngView>> {
    const paginationOptions: any = {
      ...options,
      applicationId,
    };

    const applications =
      await this.applicationOngViewRepository.getManyPaginated(
        APPLICATION_ONG_FILTERS_CONFIG,
        paginationOptions,
      );

    // Map the logo url
    const items =
      await this.fileManagerService.mapLogoToEntity<ApplicationOngView>(
        applications.items,
      );

    return {
      ...applications,
      items,
    };
  }

  public async restrict(
    applicationId: number,
    organizationId: number,
  ): Promise<void> {
    await this.ongApplicationService.update(
      organizationId,
      applicationId,
      OngApplicationStatus.RESTRICTED,
    );
  }

  public async restore(
    applicationId: number,
    organizationId: number,
  ): Promise<void> {
    await this.ongApplicationService.update(
      organizationId,
      applicationId,
      OngApplicationStatus.ACTIVE,
    );
  }

  /**
   * @description
   * Metoda destinata utilizatorilor de tip admin ce intoarce o lista cu
   * aplicatiile pentru o organizatie si status lor in relatie cu organizatia.
   *
   *  Metoda descrie lista de applicatii a unei organizatii
   */
  public async findApplicationsForOng(
    organizationId: number,
  ): Promise<ApplicationWithOngStatus[]> {
    const applications = await this.applicationRepository
      .getQueryBuilder()
      .select(ORGANIZATION_ALL_APPS_COLUMNS)
      .leftJoin(
        'ong_application',
        'ongApp',
        'ongApp.applicationId = application.id',
      )
      .where('ongApp.organizationId = :organizationId', { organizationId })
      .andWhere('ongApp.status != :status', {
        status: OngApplicationStatus.PENDING,
      })
      .orWhere('application.type = :type', {
        type: ApplicationTypeEnum.INDEPENDENT,
      })
      .execute();

    return this.fileManagerService.mapLogoToEntity<ApplicationWithOngStatus>(
      applications,
    );
  }

  public async countApplications(
    options?: FindManyOptions<Application>,
  ): Promise<number> {
    return this.applicationRepository.count(options);
  }

  public async countActiveWithApplication(
    pullingType: ApplicationPullingType,
  ): Promise<number> {
    const count = this.ongApplicationRepository
      .getQueryBuilder()
      .leftJoin('application', 'application', 'application.id = application_id')
      .where('application.pulling_type =:pullingType', {
        pullingType,
      })
      .getCount();

    return Promise.resolve(count);
  }

  /**
   * @description
   * Toate applicatiile unui ong in relatie cu access-ul unui utilzator de tip employee
   */
  private async findApplicationsForOngWithAccessStatus(
    organizationId: number,
  ): Promise<ApplicationAccess[]> {
    const applications = await this.applicationRepository
      .getQueryBuilder()
      .select([
        'ongApp.id as id',
        'application.logo as logo',
        'application.name as name',
        'NULL as status',
        'application.type as type',
      ])
      .leftJoin(
        'ong_application',
        'ongApp',
        'ongApp.applicationId = application.id',
      )
      .where('ongApp.organizationId = :organizationId', { organizationId })
      .andWhere('ongApp.status = :status', {
        status: OngApplicationStatus.ACTIVE,
      })
      .andWhere('application.status = :status', {
        status: ApplicationStatus.ACTIVE,
      })
      .execute();

    return this.fileManagerService.mapLogoToEntity<ApplicationAccess>(
      applications,
    );
  }
}
