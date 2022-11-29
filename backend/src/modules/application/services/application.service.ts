import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { Pagination } from 'src/common/interfaces/pagination';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/user/enums/role.enum';
import { FILE_TYPE } from 'src/shared/enum/FileType.enum';
import { FileManagerService } from 'src/shared/services/file-manager.service';
import { FindManyOptions, In } from 'typeorm';
import { APPLICATION_ERRORS } from '../constants/application-error.constants';
import {
  APPLICATION_FILTERS_CONFIG,
  APPLICATION_ONG_FILTERS_CONFIG,
} from '../constants/application-filters.config';
import { APPLICATIONS_FILES_DIR } from '../constants/application.constants';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ApplicationFilterDto } from '../dto/filter-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { ApplicationOngView } from '../entities/application-ong-view.entity';
import { ApplicationTableView } from '../entities/application-table-view.entity';
import { Application } from '../entities/application.entity';
import { ApplicationPullingType } from '../enums/application-pulling-type.enum';
import { ApplicationStatus } from '../enums/application-status.enum';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';
import { OngApplicationStatus } from '../enums/ong-application-status.enum';
import { ApplicationAccess } from '../interfaces/application-access.interface';
import { IOngApplicationDetails } from '../interfaces/ong-application.interface';
import { ApplicationOngViewRepository } from '../repositories/application-ong-view.repository';
import { ApplicationTableViewRepository } from '../repositories/application-table-view.repository';
import { ApplicationRepository } from '../repositories/application.repository';
import { OngApplicationRepository } from '../repositories/ong-application.repository';
import { UserOngApplicationRepository } from '../repositories/user-ong-application.repository';

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);

  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly fileManagerService: FileManagerService,
    private readonly applicationTableViewRepository: ApplicationTableViewRepository,
    private readonly ongApplicationRepository: OngApplicationRepository,
    private readonly userOngApplicationRepository: UserOngApplicationRepository,
    private readonly applicationOngViewRepository: ApplicationOngViewRepository,
  ) {}

  public async create(
    createApplicationDto: CreateApplicationDto,
    logo: Express.Multer.File[],
  ): Promise<Application> {
    try {
      // 1. Apart from independent apps the login link is mandatory
      if (
        createApplicationDto.type !== ApplicationTypeEnum.INDEPENDENT &&
        !createApplicationDto.loginLink
      ) {
        throw new BadRequestException({ ...APPLICATION_ERRORS.CREATE.LOGIN });
      }

      // 2. upload logo
      if (logo && logo.length > 0) {
        const uploadedFile = await this.fileManagerService.uploadFiles(
          `${APPLICATIONS_FILES_DIR}`,
          logo,
          FILE_TYPE.IMAGE,
          createApplicationDto.name,
        );

        createApplicationDto = {
          ...createApplicationDto,
          logo: uploadedFile[0],
        };
      }

      // 3. save the app
      return this.applicationRepository.save({
        ...createApplicationDto,
      });
    } catch (error) {
      this.logger.error({
        error: { error },
        ...APPLICATION_ERRORS.UPLOAD,
      });
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          ...APPLICATION_ERRORS.UPLOAD,
          error,
        });
      }
    }
  }

  /**
   * Get all aplications with statistics for super-admin
   * @param options
   * @returns
   */
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
   * Find all organizations with access to an application
   * @param applicationId
   * @param options
   * @returns
   */
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

  /**
   * This method is used to assign/show status of assignment for an application in relation to an employee
   * @param organizationId
   * @param userId
   * @returns
   */
  public async findActiveOngApplications(
    organizationId: number,
    userId?: number,
  ): Promise<ApplicationAccess[]> {
    const applicationsQuery = await this.applicationRepository
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
      .where('ongApp.organizationId = :organizationId', { organizationId })
      .andWhere('ongApp.status = :status', {
        status: OngApplicationStatus.ACTIVE,
      })
      .andWhere('application.status = :status', {
        status: ApplicationStatus.ACTIVE,
      });

    if (userId) {
      applicationsQuery.leftJoin(
        'user_ong_application',
        'userOngApp',
        'userOngApp.ongApplicationId = ongApp.id and userOngApp.userId = :userId',
        { userId },
      );
    } else {
      applicationsQuery.leftJoin(
        'user_ong_application',
        'userOngApp',
        'userOngApp.ongApplicationId = ongApp.id',
      );
    }

    const applications = await applicationsQuery.execute();

    return this.fileManagerService.mapLogoToEntity<ApplicationAccess>(
      applications,
    );
  }

  /**
   * @description
   * Metoda destinata utilizatorilor de tip admin ce intoarce o aplicatiile din ong-hub si status ei in relatie cu organizatia din care face parte admin-ul
   * Metoda descrie pagina de detalii aplicatie din portal
   */
  public async findOne(
    user: User,
    applicationId: number,
  ): Promise<IOngApplicationDetails> {
    let applicationWithDetailsQuery = this.applicationRepository
      .getQueryBuilder()
      .select([
        'application.id as id',
        'application.status as status',
        'ongApp.status as "ongStatus"',
        'userOngApp.status as "userStatus"',
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
        { organizationId: user.organizationId },
      )
      .leftJoin(
        'user_ong_application',
        'userOngApp',
        'userOngApp.ong_application_id = ongApp.id',
      )
      .where('application.id = :applicationId', { applicationId });

    // for employee add further filtersin by user id
    if (user.role === Role.EMPLOYEE) {
      applicationWithDetailsQuery
        .andWhere('userOngApp.userId = :userId', { userId: user.id })
        .orWhere('application.type = :type', {
          type: ApplicationTypeEnum.INDEPENDENT,
        });
    }

    const applicationWithDetails = await applicationWithDetailsQuery.execute();

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

    return {
      ...applicationWithDetails,
      logo,
    };
  }

  public async findOneByCognitoId(cognitoId: string): Promise<Application> {
    return this.applicationRepository.get({
      where: { cognitoClientId: cognitoId },
    });
  }

  public async update(
    id: number,
    updateApplicationDto: UpdateApplicationDto,
    logo?: Express.Multer.File[],
  ): Promise<Application> {
    try {
      // 1. check if application exists
      const application = await this.applicationRepository.get({
        where: { id },
      });

      if (!application) {
        throw new NotFoundException({
          ...APPLICATION_ERRORS.GET,
        });
      }

      let applicationPayload = {
        id,
        ...updateApplicationDto,
        steps: updateApplicationDto.steps || null,
      };

      // 2. handle logo
      if (logo && logo.length > 0) {
        if (application.logo) {
          await this.fileManagerService.deleteFiles([application.logo]);
        }

        const uploadedFile = await this.fileManagerService.uploadFiles(
          `${APPLICATIONS_FILES_DIR}`,
          logo,
          FILE_TYPE.IMAGE,
          application.name,
        );

        applicationPayload = {
          ...applicationPayload,
          logo: uploadedFile[0],
        };
      }

      return this.applicationRepository.update({ id }, applicationPayload);
    } catch (error) {
      this.logger.error({
        error: { error },
        ...APPLICATION_ERRORS.UPLOAD,
      });
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          ...APPLICATION_ERRORS.UPLOAD,
          error,
        });
      }
    }
  }

  public async delete(id: number): Promise<void> {
    try {
      // 1. get all organization who have access to this application
      const ongApplications = await this.ongApplicationRepository.getMany({
        where: { applicationId: id },
      });

      // map organization ids for easy usage
      const ongApplicationsIds = ongApplications.map((app) => app.id);

      // 2. check if any organizations have access to the app
      if (ongApplications.length > 0) {
        // 2.1 remove all user organization application connections
        await this.userOngApplicationRepository.remove({
          where: { ongApplicationId: In(ongApplicationsIds) },
        });

        // 2.2. remove all organization application connections
        await this.ongApplicationRepository.remove({
          where: { id: In(ongApplicationsIds) },
        });
      }

      // 3. Remove tha actual application
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

  public async countActiveApplicationsForOng(
    organizationId: number,
  ): Promise<number> {
    const applications = await this.applicationRepository
      .getQueryBuilder()
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
      .getCount();

    return applications;
  }
}
