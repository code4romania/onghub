import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ApplicationRepository } from '../repositories/application.repository';
import { Application } from '../entities/application.entity';
import {
  APPLICATION_HTTP_ERRORS_MESSAGES,
  APPLICATION_ERROR_CODES,
  APPLICATION_ERRORS,
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
import { OngApplicationStatus } from '../enums/ong-application-status.enum';

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

  public async findOne(id: number): Promise<Application> {
    const application = await this.applicationRepository.get({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException({
        message: APPLICATION_HTTP_ERRORS_MESSAGES.APPLICATION,
        errorCode: APPLICATION_ERROR_CODES.APP001,
      });
    }

    return application;
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
      .select([
        'application.id as id',
        'application.logo as logo',
        'application.name as name',
        'application.short_description as shortdescription',
        'ongApp.status as status',
      ])
      .leftJoin(
        'ong_application',
        'ongApp',
        'ongApp.applicationId = application.id AND ongApp.organizationId = :organizationId',
        { organizationId },
      )
      .execute();
  }

  public async findOneForOng(
    organizationId: number,
    applicationId: number,
  ): Promise<ApplicationWithOngStatusDetails> {
    return Promise.resolve({
      id: 1,
      status: OngApplicationStatus.ACTIVE,
      name: 'Test',
      logo: null,
      shortdescription:
        'Lorem ipsum, Lorem ipsum, Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum',
      type: ApplicationTypeEnum.SIMPLE,
      steps: ['Step1', 'Step2'],
      description:
        'Lorem ipsum, Lorem ipsum, Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum',
      website: 'www.google.com',
      loginlink: 'www.google.com',
      videolink: 'https://www.youtube.com/watch?v=kjrz7ZeCU8I',
    });
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
        message: APPLICATION_HTTP_ERRORS_MESSAGES.APPLICATION,
        errorCode: APPLICATION_ERROR_CODES.APP002,
      });
    }

    return this.applicationRepository.save({
      id,
      ...updateApplicationDto,
    });
  }

  // TODO: To be implemented
  public async deleteOne(id: number): Promise<{ success: boolean }> {
    return Promise.resolve({ success: true });
  }

  // TODO: To be implemented
  public async deleteOneForOng(
    organizationId: number,
    id: number,
  ): Promise<{ success: boolean }> {
    return Promise.resolve({ success: true });
  }

  public async restrict(applicationId: number): Promise<{ success: boolean }> {
    return Promise.resolve({ success: true });
  }
}
