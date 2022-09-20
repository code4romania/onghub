import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ApplicationRepository } from '../repositories/application.repository';
import { Application } from '../entities/application.entity';
import {
  APPLICATION_ERRORS,
  ONG_APPLICATION_ERRORS,
} from '../constants/application-error.constants';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';
import { ApplicationFilterDto } from '../dto/filter-application.dto';
import { Pagination } from 'src/common/interfaces/pagination';
import { APPLICATION_FILTERS_CONFIG } from '../constants/application-filters.config';
import {
  ApplicationWithOngStatus,
  ApplicationWithOngStatusDetails,
} from '../interfaces/application-with-ong-status.interface';
import {
  APPLICATIONS_FILES_DIR,
  ORGANIZATION_ALL_APPS_COLUMNS,
} from '../constants/application.constants';
import { OngApplicationService } from './ong-application.service';
import { OngApplicationStatus } from '../enums/ong-application-status.enum';
import { ApplicationAccess } from '../interfaces/application-access.interface';
import { ApplicationView } from '../entities/application-view.entity';
import { ApplicationViewRepository } from '../repositories/application-view.repository';
import { FileManagerService } from 'src/shared/services/file-manager.service';
import { ApplicationStatus } from '../enums/application-status.enum';
import { OrganizationApplicationFilterDto } from '../dto/organization-application.filters.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/user/enums/role.enum';

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly applicationViewRepository: ApplicationViewRepository,
    private readonly ongApplicationService: OngApplicationService,
    private readonly fileManagerService: FileManagerService,
  ) {}

  public async create(
    createApplicationDto: CreateApplicationDto,
    logo: Express.Multer.File[],
  ): Promise<Application> {
    if (
      createApplicationDto.type !== ApplicationTypeEnum.INDEPENDENT &&
      !createApplicationDto.loginLink
    ) {
      throw new BadRequestException({ ...APPLICATION_ERRORS.CREATE.LOGIN });
    }

    if (logo && logo.length > 0) {
      try {
        const uploadedFile = await this.fileManagerService.uploadFiles(
          `${APPLICATIONS_FILES_DIR}`,
          logo,
          createApplicationDto.name,
        );

        createApplicationDto = {
          ...createApplicationDto,
          logo: uploadedFile[0],
        };
      } catch (error) {
        this.logger.error({
          error: { error },
          ...APPLICATION_ERRORS.UPLOAD,
        });
        const err = error?.response;
        throw new BadRequestException({
          ...APPLICATION_ERRORS.UPLOAD,
          error: err,
        });
      }
    }

    return this.applicationRepository.save({
      ...createApplicationDto,
    });
  }

  public async findAll(
    options: ApplicationFilterDto,
  ): Promise<Pagination<ApplicationView>> {
    const paginationOptions: any = {
      ...options,
    };

    const applications = await this.applicationViewRepository.getManyPaginated(
      APPLICATION_FILTERS_CONFIG,
      paginationOptions,
    );

    // Map the logo url
    const items = await this.mapLogoToApplications<ApplicationView>(
      applications.items,
    );

    return {
      ...applications,
      items,
    };
  }

  /**
   * @description
   * Metoda destinata utilizatorilor de tip admin ce intoarce o lista cu
   * toate aplicatiile din hub si status lor in relatie cu organizatia din care face parte admin-ul
   *
   *  Metoda descrie lista de applicatii din ONG-HUB
   *
   * OngApplication.status va fi NULL daca aplicatia nu este asignata organizatiei din care face parte admin-ul
   */
  public async findApplications(
    organizationId: number,
  ): Promise<ApplicationWithOngStatus[]> {
    const applications = await this.applicationRepository
      .getQueryBuilder()
      .select(ORGANIZATION_ALL_APPS_COLUMNS)
      .leftJoin(
        'ong_application',
        'ongApp',
        'ongApp.applicationId = application.id AND ongApp.organizationId = :organizationId',
        { organizationId },
      )
      .execute();

    const applicationsWithStatus = applications.map(this.mapApplicationStatus);

    return this.mapLogoToApplications<ApplicationWithOngStatus>(
      applicationsWithStatus,
    );
  }

  public async findOrganizationAplications(
    user: User,
    filters: OrganizationApplicationFilterDto,
  ): Promise<ApplicationWithOngStatus[] | ApplicationAccess[]> {
    const { status } = filters;

    // ADMIN Handling
    if (user.role === Role.ADMIN) {
      // ALL active applications assigned to an ONG available to be assigned to a user
      if (status === ApplicationStatus.ACTIVE) {
        return this.findApplicationsForOngWithAccessStatus(user.organizationId);
      } else {
        // return all ONG application with ong status
        return this.findApplicationsForOng(user.organizationId);
      }
    }

    // USER Handling
    if (user.role === Role.EMPLOYEE) {
      throw new NotImplementedException();
    }
  }

  /**
   * @description
   * Toate applicatiile unui ong in cu statusul de access al unui utilzator
   */
  public async findActiveApplicationsForOngUserWithAccessStatus(
    organizationId: number,
    userId: number,
  ): Promise<ApplicationAccess[]> {
    return this.applicationRepository
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
  }

  /**
   * @description
   * Metoda destinata utilizatorilor de tip admin ce intoarce o aplicatiile din ong-hub si status ei in relatie cu organizatia din care face parte admin-ul
   * Metoda descrie pagina de detalii aplicatie din portal
   *
   * OngApplication.status va fi NULL daca aplicatia nu este asignata organizatiei din care face parte admin-ul
   */
  public async findOne(
    organizationId: number,
    applicationId: number,
  ): Promise<ApplicationWithOngStatusDetails> {
    const applicationWithDetails = await this.applicationRepository
      .getQueryBuilder()
      .select([
        'application.id as id',
        'ongApp.status as status',
        'application.name as name',
        'application.logo as logo',
        'application.short_description as "shortDescription"',
        'application.description as description',
        'application.type as type',
        'application.steps as steps',
        'application.website as website',
        'application.login_link as "loginLink"',
        'application.video_link as "videoLink"',
        'application.management_url as "managementUrl"',
        'application.status as "applicationStatus"',
      ])
      .leftJoin(
        'ong_application',
        'ongApp',
        'ongApp.applicationId = application.id AND ongApp.organizationId = :organizationId',
        { organizationId: organizationId },
      )
      .where('application.id = :applicationId', { applicationId })
      .getRawOne();

    if (!applicationWithDetails) {
      throw new NotFoundException(APPLICATION_ERRORS.GET);
    }

    // generate public url for logo
    let logo = null;
    if (applicationWithDetails.logo) {
      logo = await this.fileManagerService.generatePresignedURL(
        applicationWithDetails.logo,
      );
    }

    return this.mapApplicationStatus({
      ...applicationWithDetails,
      logo,
    }) as ApplicationWithOngStatusDetails;
  }

  public async update(
    id: number,
    updateApplicationDto: UpdateApplicationDto,
    logo: Express.Multer.File[],
  ): Promise<Application> {
    const application = await this.applicationRepository.get({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException({
        ...APPLICATION_ERRORS.GET,
      });
    }

    // check for logo and update
    if (logo && logo.length > 0) {
      try {
        if (application.logo) {
          await this.fileManagerService.deleteFiles([application.logo]);
        }

        const uploadedFile = await this.fileManagerService.uploadFiles(
          `${APPLICATIONS_FILES_DIR}`,
          logo,
          application.name,
        );

        return this.applicationRepository.save({
          id,
          ...updateApplicationDto,
          logo: uploadedFile[0],
        });
      } catch (error) {
        this.logger.error({
          error: { error },
          ...APPLICATION_ERRORS.UPLOAD,
        });
        const err = error?.response;
        throw new BadRequestException({
          ...APPLICATION_ERRORS.UPLOAD,
          error: err,
        });
      }
    }

    return this.applicationRepository.save({
      id,
      ...updateApplicationDto,
    });
  }

  public async restrict(
    applicationId: number,
    organizationId: number,
  ): Promise<void> {
    const ongApplication = await this.ongApplicationService.findOne({
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

    await this.ongApplicationService.update(
      organizationId,
      organizationId,
      OngApplicationStatus.RESTRICTED,
    );
  }

  // TODO: To be implemented
  public async deleteOne(id: number): Promise<void> {
    throw new NotImplementedException();
  }

  /**
   * @description
   * Metoda destinata utilizatorilor de tip admin ce intoarce o lista cu
   * aplicatiile pentru o organizatie si status lor in relatie cu organizatia.
   *
   *  Metoda descrie lista de applicatii a unei organizatii
   */
  private async findApplicationsForOng(
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
      .orWhere('application.type = :type', {
        type: ApplicationTypeEnum.INDEPENDENT,
      })
      .execute();

    const applicationsWithStatus = applications.map(this.mapApplicationStatus);

    return this.mapLogoToApplications(applicationsWithStatus);
  }

  /**
   * @description
   * Toate applicatiile unui ong in relatie cu access-ul unui utilzator de tip employee
   */
  private async findApplicationsForOngWithAccessStatus(
    organizationId: number,
  ): Promise<ApplicationAccess[]> {
    return this.applicationRepository
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
  }

  /**
   * @description
   * Map public files URLS for all applications which have logo as path
   */
  private async mapLogoToApplications<T extends { logo: string }>(
    applications: T[],
  ): Promise<T[]> {
    try {
      const applicationsWithLogo = applications.map(async (app: T) => {
        if (app.logo !== null) {
          const logo = await this.fileManagerService.generatePresignedURL(
            app.logo,
          );
          return { ...app, logo };
        }
        return app;
      });

      return Promise.all(applicationsWithLogo);
    } catch (error) {
      this.logger.error({
        error: { error },
        ...APPLICATION_ERRORS.GENERATE_URL,
      });
      const err = error?.response;
      throw new BadRequestException({
        ...APPLICATION_ERRORS.GENERATE_URL,
        error: err,
      });
    }
  }

  /**
   * @description
   * Map correct application status meaning that if the application status meaning that if an ong application has an active staus but the application itself is disabeled
   * the user will receive the disabled status.
   *
   * The ong application restricted status will always overcome the application disabled status as the user dosen't need to know if the application is disabled as long as he is restricted from using it.
   */
  private mapApplicationStatus(
    application: ApplicationWithOngStatus & {
      applicationStatus: ApplicationStatus;
    },
  ): ApplicationWithOngStatus | ApplicationWithOngStatusDetails {
    const { applicationStatus, status, ...applicationRemains } = application;

    const finalStatus =
      applicationStatus === ApplicationStatus.DISABLED &&
      status !== OngApplicationStatus.RESTRICTED
        ? ApplicationStatus.DISABLED
        : status;

    return {
      ...applicationRemains,
      status: finalStatus,
    };
  }
}
