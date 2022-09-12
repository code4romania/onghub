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
import { FileManagerService } from 'src/shared/services/file-manager.service';

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger(ApplicationService.name);
  constructor(
    private readonly applicationRepository: ApplicationRepository,
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
  ): Promise<Pagination<Application>> {
    const paginationOptions: any = {
      ...options,
    };

    return this.applicationRepository.getManyPaginated(
      APPLICATION_FILTERS_CONFIG,
      paginationOptions,
    );
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
  public async findAllForOng(
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

    return this.mapLogoToApplications(applications);
  }

  /**
   * @description
   * Metoda destinata utilizatorilor de tip admin ce intoarce o lista cu
   * aplicatiile pentru o organizatie si status lor in relatie cu organizatia.
   *
   *  Metoda descrie lista de applicatii a unei organizatii
   */
  public async findAllForOngUser(
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

    return this.mapLogoToApplications(applications);
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

    return {
      ...applicationWithDetails,
      logo,
    };
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
    if (application.logo && logo && logo.length > 0) {
      try {
        await this.fileManagerService.deleteFiles([application.logo]);

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
   * Map public files URLS for all applications which have logo as path
   */
  private async mapLogoToApplications(
    applications: ApplicationWithOngStatus[],
  ): Promise<ApplicationWithOngStatus[]> {
    try {
      const applicationsWithLogo = applications.map(
        async (app: ApplicationWithOngStatus) => {
          if (app.logo !== null) {
            const logo = await this.fileManagerService.generatePresignedURL(
              app.logo,
            );
            return { ...app, logo };
          }
          return app;
        },
      );

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
}
