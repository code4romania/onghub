import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ApplicationRepository } from '../repositories/application.repository';
import { Application } from '../entities/application.entity';
import {
  APPLICATION_ERRORS,
  ONG_APPLICATION_ERRORS,
  USER_ONG_APPLICATION_ERRORS,
} from '../constants/application-error.constants';
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
import { OrganizationService } from 'src/modules/organization/services';
import { FindManyOptions, In } from 'typeorm';
import { MAIL_OPTIONS } from 'src/mail/constants/template.constants';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import { UserStatus } from 'src/modules/user/enums/user-status.enum';
import { UserOngApplicationService } from './user-ong-application.service';
import { UserOngApplicationStatus } from '../enums/user-ong-application-status.enum';
import { USER_ERRORS } from 'src/modules/user/constants/user-error.constants';
import { ORGANIZATION_ERRORS } from 'src/modules/organization/constants/errors.constants';
import { ApplicationRequestRepository } from '../repositories/application-request.repository';
import { ApplicationPullingType } from '../enums/application-pulling-type.enum';
import { OngApplicationRepository } from '../repositories/ong-application.repository';

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly applicationOngViewRepository: ApplicationOngViewRepository,
    private readonly applicationTableViewRepository: ApplicationTableViewRepository,
    private readonly applicationRequestRepository: ApplicationRequestRepository,
    private readonly ongApplicationService: OngApplicationService,
    private readonly userOngApplicationService: UserOngApplicationService,
    private readonly fileManagerService: FileManagerService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly organizationService: OrganizationService,
    private readonly ongApplicationRepository: OngApplicationRepository,
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
        'userOngApp.status as status',
        'application.name as name',
        'application.logo as logo',
        'application.short_description as "shortDescription"',
        'application.description as description',
        'application.type as type',
        'application.steps as steps',
        'application.website as website',
        'application.login_link as "loginLink"',
        'application.video_link as "videoLink"',
        'application.pulling_type as "pullingType"',
        'application.status as "applicationStatus"',
      ])
      .leftJoin(
        'ong_application',
        'ongApp',
        'ongApp.applicationId = application.id AND ongApp.organizationId = :organizationId',
        { organizationId: organizationId },
      )
      .leftJoin(
        'user_ong_application',
        'userOngApp',
        'userOngApp.ong_application_id = ongApp.id',
      )
      .where('application.id = :applicationId', { applicationId })
      .andWhere('ongApp.status = :status', {
        status: OngApplicationStatus.ACTIVE,
      })
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

    // if application is disabled, sign out all users from all organizations who have access to the app
    if (updateApplicationDto.status === ApplicationStatus.DISABLED) {
      const ongApplications = await this.ongApplicationService.findMany({
        where: { applicationId: id },
      });
      ongApplications.map(async (ongApplication) => {
        await this.userService.signOutAllOrganization(
          ongApplication.organizationId,
        );
      });
    }

    return this.applicationRepository.update({ id }, updateApplicationDto);
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

    await this.userService.signOutAllOrganization(organizationId);
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

      const organziation = await this.organizationService.findWithRelations(
        organizationId,
      );

      // send email to admin to delete the application
      const {
        template,
        subject,
        context: {
          title,
          cta: { label },
        },
      } = MAIL_OPTIONS.ORGANIZATION_APPLICATION_REQUEST_DELETE;

      await this.mailService.sendEmail({
        to: superAdmins.map((user) => user.email),
        template,
        subject,
        context: {
          title,
          subtitle:
            MAIL_OPTIONS.ORGANIZATION_APPLICATION_REQUEST_DELETE.context.subtitle(
              organziation.organizationGeneral.name,
              application.name,
            ),
          cta: {
            link: MAIL_OPTIONS.ORGANIZATION_APPLICATION_REQUEST_DELETE.context.cta.link(
              organizationId.toString(),
            ),
            label,
          },
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
    try {
      // 1. get all organization who have access to this application
      const ongApplications = await this.ongApplicationService.findMany({
        where: { applicationId: id },
      });

      // map organization ids for easy usage
      const ongApplicationsIds = ongApplications.map((app) => app.id);

      // 2. check if any organizations have access to the app
      if (ongApplications.length > 0) {
        // 2.1 remove all user organization application connections
        await this.userOngApplicationService.remove({
          where: { ongApplicationId: In(ongApplicationsIds) },
        });

        // 2.2. remove all organization application connections
        await this.ongApplicationService.remove({
          where: { id: In(ongApplicationsIds) },
        });
      }

      // 3. check if there are any application request for this app
      const applicationRequests =
        await this.applicationRequestRepository.getMany({
          where: { applicationId: id },
        });

      // 4. remove all requests for this app
      if (applicationRequests.length > 0) {
        // map requests ids for easy usage
        const applicationRequestIds = applicationRequests.map((req) => req.id);

        // 4.1 remove all requests
        await this.applicationRequestRepository.remove({
          where: { id: In(applicationRequestIds) },
        });
      }

      // 5. Remove tha actual application
      await this.applicationRepository.remove({ where: { id } });
    } catch (error) {
      this.logger.error({ error, ...APPLICATION_ERRORS.DELETE });
      const err = error?.response;
      throw new BadRequestException({
        error: err,
        ...APPLICATION_ERRORS.DELETE,
      });
    }
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

  public async countApplications(
    options?: FindManyOptions<Application>,
  ): Promise<number> {
    return this.applicationRepository.count(options);
  }

  /**
   *
   * @param cognitoApplicationId
   * @param cognitoUserId
   * @returns TODO document errors
   */
  public async hasAccess(
    cognitoApplicationId: string,
    cognitoUserId: string,
  ): Promise<boolean> {
    // 1. Find the user who is requesting the access and check the status
    const user: User = await this.userService.findByCognitoId(cognitoUserId);

    // 1.1. Rare case where we don't have the user in evidence (only if was created somewhere else / in cognito directly maybe)
    if (!user) {
      throw new ForbiddenException(USER_ERRORS.GET);
    }

    // 1.2. The user is restricted, stop here
    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(USER_ERRORS.RESTRICTED);
    }

    // 2. Find the organization of the user

    // 2.1. SuperAdmins have no organization, are not allowed to access apps
    if (!user.organizationId) {
      throw new ForbiddenException(USER_ERRORS.MISSING_ORGANIZATION);
    }

    const organization = await this.organizationService.find(
      user?.organizationId,
    );

    // 2.2. The organization is not ACTIVE, stop here
    if (organization.status !== OrganizationStatus.ACTIVE) {
      throw new ForbiddenException(ORGANIZATION_ERRORS.RESTRICTED);
    }

    // 3. Check if the application exists and it's ACTIVE
    const application = await this.applicationRepository.get({
      where: { cognitoClientId: cognitoApplicationId },
    });

    // 3.1. The application requested does not exist
    if (!application) {
      throw new ForbiddenException(APPLICATION_ERRORS.GET);
    }

    // 3.2. The application is inactive
    if (application.status !== ApplicationStatus.ACTIVE) {
      throw new ForbiddenException(APPLICATION_ERRORS.INACTIVE);
    }

    // 4. Check if the NGO and the user has access to the application
    // 4.1. Find the relation between the NGO (of the requester) and the Application
    const ongApplication = await this.ongApplicationService.findOne({
      where: {
        organizationId: user.organizationId,
        applicationId: application.id,
      },
    });

    // 4.1.1. The relation between ONG and App does not exist
    if (!ongApplication) {
      throw new ForbiddenException(ONG_APPLICATION_ERRORS.RELATION_MISSING);
    }

    // 4.1.2. The relation exists but is not active (is restricted)
    if (ongApplication.status !== OngApplicationStatus.ACTIVE) {
      throw new ForbiddenException(ONG_APPLICATION_ERRORS.RELATION_RESTRICTED);
    }

    // 4.2. Find the relation between the USER and the Application (the relation of the NGO)
    const userOngApplication = await this.userOngApplicationService.findOne({
      where: {
        userId: user.id,
        ongApplicationId: ongApplication.id,
      },
    });

    // 4.2.1. The relation may not exist or is restricted, access denied
    if (
      !userOngApplication ||
      userOngApplication.status !== UserOngApplicationStatus.ACTIVE
    ) {
      throw new ForbiddenException(
        USER_ONG_APPLICATION_ERRORS.MISSING_PERMISSION,
      );
    }

    return true;
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
