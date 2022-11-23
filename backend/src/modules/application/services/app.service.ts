import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Pagination } from 'src/common/interfaces/pagination';
import { User } from 'src/modules/user/entities/user.entity';
import { FILE_TYPE } from 'src/shared/enum/FileType.enum';
import { FileManagerService } from 'src/shared/services/file-manager.service';
import { APPLICATION_ERRORS } from '../constants/application-error.constants';
import { APPLICATION_FILTERS_CONFIG } from '../constants/application-filters.config';
import { APPLICATIONS_FILES_DIR } from '../constants/application.constants';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ApplicationFilterDto } from '../dto/filter-application.dto';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { ApplicationTableView } from '../entities/application-table-view.entity';
import { Application } from '../entities/application.entity';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';
import { ApplicationWithOngStatusDetails } from '../interfaces/application-with-ong-status.interface';
import { ApplicationTableViewRepository } from '../repositories/application-table-view.repository';
import { ApplicationRepository } from '../repositories/application.repository';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly fileManagerService: FileManagerService,
    private readonly applicationTableViewRepository: ApplicationTableViewRepository,
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
   * Metoda destinata utilizatorilor de tip admin ce intoarce o aplicatiile din ong-hub si status ei in relatie cu organizatia din care face parte admin-ul
   * Metoda descrie pagina de detalii aplicatie din portal
   *
   * OngApplication.status va fi NULL daca aplicatia nu este asignata organizatiei din care face parte admin-ul
   */
  public async findOne(
    user: User,
    applicationId: number,
  ): Promise<ApplicationWithOngStatusDetails> {
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

    // if (user.role === Role.EMPLOYEE) {
    //   applicationWithDetailsQuery = applicationWithDetailsQuery.andWhere(
    //     new Brackets((qb) => {
    //       qb.where(
    //         'application.type != :type AND userOngApp.status = :status',
    //         {
    //           status: UserOngApplicationStatus.ACTIVE,
    //           type: ApplicationTypeEnum.INDEPENDENT,
    //         },
    //       ).orWhere('application.type = :type', {
    //         type: ApplicationTypeEnum.INDEPENDENT,
    //       });
    //     }),
    //   );
    // }

    const applicationWithDetails =
      await applicationWithDetailsQuery.getRawOne();

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

        return this.applicationRepository.save({
          id,
          ...updateApplicationDto,
          logo: uploadedFile[0],
        });
      }

      return this.applicationRepository.update({ id }, updateApplicationDto);
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
}
