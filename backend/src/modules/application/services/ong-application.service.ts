import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { Pagination } from 'src/common/interfaces/pagination';
import { EVENTS } from 'src/modules/notifications/constants/events.contants';
import DeleteAppRequestEvent from 'src/modules/notifications/events/delete-app-request-event.class';
import { FindOneOptions } from 'typeorm';
import { S3FileManagerService } from 'src/shared/services/s3-file-manager.service';
import {
  APPLICATION_ERRORS,
  APPLICATION_REQUEST_ERRORS,
  ONG_APPLICATION_ERRORS,
} from '../constants/application-error.constants';
import { APPLICATION_REQUEST_FILTERS_CONFIG } from '../constants/application-filters.config';
import { ORGANIZATION_ALL_APPS_COLUMNS } from '../constants/application.constants';
import { OrganizationApplicationFilterDto } from '../dto/organization-application.filters.dto';
import { OngApplication } from '../entities/ong-application.entity';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';
import { OngApplicationStatus } from '../enums/ong-application-status.enum';
import { IOngApplication } from '../interfaces/ong-application.interface';
import { OrganizationApplicationRequest } from '../interfaces/organization-application-request.interface';
import { ApplicationRepository } from '../repositories/application.repository';
import { OngApplicationRepository } from '../repositories/ong-application.repository';
import { UserOngApplicationRepository } from '../repositories/user-ong-application.repository';
import { OngApplicationFilterDto } from '../dto/ong-application-filters.dto';

@Injectable()
export class OngApplicationService {
  private readonly logger = new Logger(OngApplicationService.name);
  constructor(
    private readonly ongApplicationRepository: OngApplicationRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly userOngApplicationRepository: UserOngApplicationRepository,
    private readonly fileManagerService: S3FileManagerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * @description
   * Se creeaza legatura dintre un ONG si o aplicatie si status-ul acelei legaturi, in acest moment o aplicatie este adaugata in "aplicatiile mele" pentru un ONG
   * EX: Applicatie X este restrictionata pentru Organizatia Y
   */
  public async create(
    organizationId: number,
    applicationId: number,
  ): Promise<OngApplication> {
    try {
      // 1. check if application is active
      const application = await this.applicationRepository.get({
        where: { id: applicationId },
      });

      if (!application) {
        throw new NotFoundException(APPLICATION_ERRORS.GET);
      }

      if (application.type === ApplicationTypeEnum.INDEPENDENT) {
        throw new BadRequestException({
          ...APPLICATION_REQUEST_ERRORS.CREATE.APPLICATION_TYPE,
        });
      }

      // 2. check if the app is already assigned to that ong
      const ongApplication = await this.ongApplicationRepository.get({
        where: {
          applicationId,
          organizationId,
        },
      });

      if (ongApplication) {
        throw new BadRequestException({
          ...APPLICATION_REQUEST_ERRORS.CREATE.REQ_EXISTS,
        });
      }

      const ongApp = await this.ongApplicationRepository.save({
        organizationId,
        applicationId,
        status:
          application.type === ApplicationTypeEnum.STANDALONE
            ? OngApplicationStatus.PENDING
            : OngApplicationStatus.ACTIVE,
      });

      return ongApp;
    } catch (error) {
      this.logger.error({ error: { error }, ...ONG_APPLICATION_ERRORS.CREATE });
      const err = error?.response;
      throw new BadRequestException({
        ...ONG_APPLICATION_ERRORS.CREATE,
        error: err,
      });
    }
  }

  /**
   * Get all applications assigned to an organization with statuses
   */
  public async findApplicationsByOrganizationId(
    organizationId: number,
    options?: OrganizationApplicationFilterDto,
  ): Promise<IOngApplication[]> {
    const { search, type } = options;

    // 1. base query
    const applicationsQuery = this.applicationRepository
      .getQueryBuilder()
      .select(ORGANIZATION_ALL_APPS_COLUMNS)
      .leftJoin(
        'ong_application',
        'ongApp',
        'ongApp.applicationId = application.id AND ongApp.organizationId = :organizationId',
        { organizationId },
      )
      .where(
        'ongApp.organizationId = :organizationId and ongApp.status != :status',
        {
          organizationId,
          status: OngApplicationStatus.PENDING,
        },
      );

    // 2. filter by search word
    if (search) {
      applicationsQuery.andWhere('application.name ilike :name', {
        name: `%${search}%`,
      });
    }

    // 3. filter by application type
    if (type) {
      applicationsQuery.andWhere('application.type = :type', { type });
    }

    const applications = await applicationsQuery.execute();

    return this.fileManagerService.mapLogoToEntity<IOngApplication>(
      applications,
    );
  }

  /**
   * @description
   * Get all applications assigned to an ONG
   * An application is assigned to an ong if it is in OngApplication table in statsu ACTIVE, RESTRICTED, PENDING
   */
  public async findOrganizationApplications(
    organizationId: number,
    options?: OngApplicationFilterDto,
  ): Promise<IOngApplication[]> {
    const { userId, showAllApps } = options;
    // 1. base query - get all available applications with statuses for organization
    const applicationsQuery = this.applicationRepository
      .getQueryBuilder()
      .select(ORGANIZATION_ALL_APPS_COLUMNS)
      .leftJoin(
        'ong_application',
        'ongApp',
        'ongApp.applicationId = application.id AND ongApp.organizationId = :organizationId',
        { organizationId },
      )
      .orderBy('application.name', 'ASC');

    // 2. Get only the applications assigned to your organization and the independent applications
    if (!showAllApps) {
      applicationsQuery.where(
        'ongApp.organizationId = :organizationId AND ongApp.status != :status OR application.type = :type',
        {
          organizationId,
          status: OngApplicationStatus.PENDING,
          type: ApplicationTypeEnum.INDEPENDENT,
        },
      );
    }

    // 3. Handle my applications for employee
    if (userId) {
      applicationsQuery
        .leftJoin(
          'user_ong_application',
          'userOngApp',
          'userOngApp.ongApplicationId = ongApp.id',
        )
        .where(
          'ongApp.organizationId = :organizationId AND userOngApp.userId = :userId',
          {
            organizationId,
            userId,
          },
        )
        .orWhere('application.type = :type', {
          type: ApplicationTypeEnum.INDEPENDENT,
        });
    }

    const applications = await applicationsQuery.execute();

    return this.fileManagerService.mapLogoToEntity<IOngApplication>(
      applications,
    );
  }

  /**
   * GET all application requests which are ong applications with staus pending
   * @param options
   * @returns
   */
  public async findAllRequests(
    options: BaseFilterDto,
  ): Promise<Pagination<OngApplication>> {
    const paginationOptions = {
      ...options,
      status: OngApplicationStatus.PENDING,
    };

    return this.ongApplicationRepository.getManyPaginated(
      APPLICATION_REQUEST_FILTERS_CONFIG,
      paginationOptions,
    );
  }

  /**
   * Get one request by organization id
   */
  public async findRequestsByOrganizationId(
    organizationId: number,
  ): Promise<OrganizationApplicationRequest[]> {
    const applicationRequests = await this.ongApplicationRepository
      .getQueryBuilder()
      .select([
        'ong_application.id as id',
        'application.logo as logo',
        'application.name as name',
        'ong_application.created_on as "createdOn"',
      ])
      .leftJoin(
        'application',
        'application',
        'application.id = ong_application.applicationId',
      )
      .where('ong_application.organizationId = :organizationId', {
        organizationId,
      })
      .andWhere('ong_application.status = :status', {
        status: OngApplicationStatus.PENDING,
      })
      .execute();

    return this.fileManagerService.mapLogoToEntity<OrganizationApplicationRequest>(
      applicationRequests,
    );
  }

  /**
   * Approve application request
   * @param ongApplicationId
   */
  public async approve(ongApplicationId: number): Promise<void> {
    const ongApp = await this.ongApplicationRepository.get({
      where: { id: ongApplicationId },
    });

    if (!ongApp) {
      throw new NotFoundException(APPLICATION_REQUEST_ERRORS.GET.NOT_FOUND);
    }

    if (ongApp.status !== OngApplicationStatus.PENDING) {
      throw new BadRequestException(
        APPLICATION_REQUEST_ERRORS.UPDATE.NOT_PENDING,
      );
    }

    await this.ongApplicationRepository.save({
      ...ongApp,
      status: OngApplicationStatus.ACTIVE,
    });
  }

  /**
   * Reject application request
   * @param ongApplicationId
   */
  public async reject(ongApplicationId: number): Promise<void> {
    const ongApp = await this.ongApplicationRepository.get({
      where: { id: ongApplicationId },
    });

    if (!ongApp) {
      throw new NotFoundException(APPLICATION_REQUEST_ERRORS.GET.NOT_FOUND);
    }

    if (ongApp.status !== OngApplicationStatus.PENDING) {
      throw new BadRequestException(
        APPLICATION_REQUEST_ERRORS.UPDATE.NOT_PENDING,
      );
    }

    await this.ongApplicationRepository.remove({
      where: { id: ongApplicationId },
    });
  }

  public async requestOngApplicationDeletion(
    applicationId: number,
    organizationId: number,
  ): Promise<void> {
    try {
      const ongApplication = await this.ongApplicationRepository.get({
        where: {
          applicationId,
          organizationId,
          status: OngApplicationStatus.ACTIVE,
        },
        relations: ['application'],
      });

      if (!ongApplication) {
        throw new NotFoundException(APPLICATION_ERRORS.GET);
      }

      // 1. If application is for standalone send email to admin
      if (ongApplication.application.type === ApplicationTypeEnum.STANDALONE) {
        this.eventEmitter.emit(
          EVENTS.DELETE_APP_REQUEST,
          new DeleteAppRequestEvent(
            organizationId,
            ongApplication.application.name,
          ),
        );

        // mark the app as to be removed
        this.ongApplicationRepository.save({
          ...ongApplication,
          status: OngApplicationStatus.PENDING_REMOVAL,
        });
      } else {
        // 2. delete the application
        return this.delete(applicationId, organizationId);
      }
    } catch (error) {
      this.logger.error({ error: { error }, ...ONG_APPLICATION_ERRORS.DELETE });
      if (error instanceof HttpException) {
        throw error;
      } else {
        const err = error?.response;
        throw new BadRequestException({
          ...ONG_APPLICATION_ERRORS.DELETE,
          error: err,
        });
      }
    }
  }

  /**
   * Get one ong application
   * @param applicationId
   * @param organizationId
   * @returns
   */
  public async findOne(
    applicationId: number,
    organizationId: number,
  ): Promise<OngApplication> {
    const ongApplication = await this.ongApplicationRepository.get({
      where: { applicationId, organizationId },
    });

    if (!ongApplication) {
      throw new NotFoundException(APPLICATION_ERRORS.GET);
    }

    return ongApplication;
  }

  /**
   * @description
   * Se sterge legatura dintre o apicatie si un ONG iar aplicatia va fi stearsa din "aplicatiile mele" pentru un ONG
   */
  public async delete(
    applicationId: number,
    organizationId: number,
    status?: OngApplicationStatus,
  ): Promise<void> {
    try {
      const ongApplication = await this.ongApplicationRepository.get({
        where: status
          ? {
              applicationId,
              organizationId,
              status,
            }
          : {
              applicationId,
              organizationId,
            },
      });

      if (!ongApplication) {
        throw new NotFoundException({
          ...ONG_APPLICATION_ERRORS.GET,
        });
      }

      await this.userOngApplicationRepository.remove({
        where: {
          ongApplicationId: ongApplication.id,
        },
      });

      await this.ongApplicationRepository.remove({
        where: { id: ongApplication.id },
      });
    } catch (error) {
      this.logger.error({ error: { error }, ...ONG_APPLICATION_ERRORS.DELETE });
      if (error instanceof HttpException) {
        throw error;
      } else {
        const err = error?.response;
        throw new BadRequestException({
          ...ONG_APPLICATION_ERRORS.DELETE,
          error: err,
        });
      }
    }
  }

  public async update(
    organizationId: number,
    applicationId: number,
    status: OngApplicationStatus,
  ): Promise<OngApplication> {
    const ongApplication = await this.ongApplicationRepository.get({
      where: {
        applicationId,
        organizationId,
      },
    });

    if (!ongApplication) {
      throw new NotFoundException({
        ...ONG_APPLICATION_ERRORS.GET,
      });
    }

    try {
      const result = await this.ongApplicationRepository.update(
        { organizationId, applicationId },
        { status },
      );

      return result;
    } catch (error) {
      this.logger.error({
        error: { error },
        ...ONG_APPLICATION_ERRORS.UPDATE,
      });
      const err = error?.response;
      throw new BadRequestException({
        ...ONG_APPLICATION_ERRORS.UPDATE,
        error: err,
      });
    }
  }

  public findOngApplicationWithOptions(
    conditions: FindOneOptions<OngApplication>,
  ): Promise<OngApplication> {
    return this.ongApplicationRepository.get(conditions);
  }
}
