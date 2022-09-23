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
import { APPLICATION_ERRORS } from '../constants/application-error.constants';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';
import { ApplicationFilterDto } from '../dto/filter-application.dto';
import { Pagination } from 'src/common/interfaces/pagination';
import {
  APPLICATION_FILTERS_CONFIG,
  APPLICATION_ONG_FILTERS_CONFIG,
} from '../constants/application-filters.config';
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
import { ApplicationStatus } from '../enums/application-status.enum';
import { FileManagerService } from 'src/shared/services/file-manager.service';
import { ApplicationOngView } from '../entities/application-ong-view.entity';
import { ApplicationOngViewRepository } from '../repositories/application-ong-view.repository';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { OrganizationApplicationFilterDto } from '../dto/organization-application.filters.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/user/enums/role.enum';
import { ApplicationTableView } from '../entities/application-table-view.entity';
import { ApplicationTableViewRepository } from '../repositories/application-table-view.repository';
import { UserService } from 'src/modules/user/services/user.service';
import { MailService } from 'src/mail/services/mail.service';
import { MAIL_TEMPLATES } from 'src/mail/enums/mail.enum';

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly applicationOngViewRepository: ApplicationOngViewRepository,
    private readonly applicationTableViewRepository: ApplicationTableViewRepository,
    private readonly ongApplicationService: OngApplicationService,
    private readonly fileManagerService: FileManagerService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
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
  ): Promise<Pagination<ApplicationTableView>> {
    const paginationOptions: any = {
      ...options,
    };

    const applications =
      await this.applicationTableViewRepository.getManyPaginated(
        APPLICATION_FILTERS_CONFIG,
        paginationOptions,
      );

    // Map the logo url
    const items =
      await this.fileManagerService.mapLogoToEntity<ApplicationTableView>(
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

    return this.fileManagerService.mapLogoToEntity<ApplicationWithOngStatus>(
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
      return this.findApplicationsForOngEmployee(user.organizationId, user.id);
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

    const applicationsWithStatus = applications.map(this.mapApplicationStatus);

    return this.fileManagerService.mapLogoToEntity<ApplicationWithOngStatus>(
      applicationsWithStatus,
    );
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

  public async update(
    id: number,
    updateApplicationDto: UpdateApplicationDto,
    logo?: Express.Multer.File[],
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

  public async deleteOngApplicationRequest(
    applicationId: number,
    organizationId: number,
  ): Promise<void> {
    const application = await this.applicationRepository.get({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException(APPLICATION_ERRORS.GET);
    }

    // 1. If application is for standalone send email to admin
    if (application.type === ApplicationTypeEnum.STANDALONE) {
      const superAdmins = await this.userService.findMany({
        where: { role: Role.SUPER_ADMIN },
      });

      // send email to admin to delete the application
      this.mailService.sendEmail({
        to: superAdmins.map((user) => user.email),
        template: MAIL_TEMPLATES.DELETE_ONG_APPLICATION_REQUEST,
        context: {
          applicationName: application.name,
        },
      });

      // mark the app as to be removed
      this.ongApplicationService.update(
        organizationId,
        applicationId,
        OngApplicationStatus.PENDING_REMOVAL,
      );
    } else {
      // 2. delete the application
      return this.ongApplicationService.delete(applicationId, organizationId);
    }
  }

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
      .orWhere('application.type = :type', {
        type: ApplicationTypeEnum.INDEPENDENT,
      })
      .execute();

    const applicationsWithStatus = applications.map(this.mapApplicationStatus);

    return this.fileManagerService.mapLogoToEntity<ApplicationWithOngStatus>(
      applicationsWithStatus,
    );
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
