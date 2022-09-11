import {
  BadRequestException,
  Injectable,
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
import { APPLICATION_FILTERS_CONFIG } from '../constants/application-filters.config';
import {
  ApplicationWithOngStatus,
  ApplicationWithOngStatusDetails,
} from '../interfaces/application-with-ong-status.interface';
import { ORGANIZATION_ALL_APPS_COLUMNS } from '../constants/application.constants';

@Injectable()
export class ApplicationService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  public async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    if (
      createApplicationDto.type !== ApplicationTypeEnum.INDEPENDENT &&
      !createApplicationDto.loginLink
    ) {
      throw new BadRequestException({ ...APPLICATION_ERRORS.CREATE.LOGIN });
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

  public async findAllForOng(
    organizationId: number,
  ): Promise<ApplicationWithOngStatus[]> {
    return this.applicationRepository
      .getQueryBuilder()
      .select(ORGANIZATION_ALL_APPS_COLUMNS)
      .leftJoin(
        'ong_application',
        'ongApp',
        'ongApp.applicationId = application.id AND ongApp.organizationId = :organizationId',
        { organizationId },
      )
      .execute();
  }

  public async findAllForOngUser(
    organizationId: number,
  ): Promise<ApplicationWithOngStatus[]> {
    return this.applicationRepository
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
  }

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
        'application.short_description as shortdescription',
        'application.description as description',
        'application.type as type',
        'application.steps as steps',
        'application.website as website',
        'application.login_link as loginlink',
        'application.video_link as videolink',
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

    return applicationWithDetails as any;
  }

  public async update(
    id: number,
    updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application> {
    const application = await this.applicationRepository.get({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException({
        ...APPLICATION_ERRORS.GET,
      });
    }

    return this.applicationRepository.save({
      id,
      ...updateApplicationDto,
    });
  }

  // TODO: To be implemented
  public async deleteOne(id: number): Promise<{ success: boolean }> {
    throw new NotImplementedException();
  }
}
