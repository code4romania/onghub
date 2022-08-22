import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ApplicationRepository } from '../repositories/application.repository';
import { Application } from '../entities/application.entity';
import {
  APPLICATION_HTTP_ERRORS_MESSAGES,
  APPLICATION_ERROR_CODES,
} from '../constants/application-error.constants';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { FindManyOptions } from 'typeorm';
import { ApplicationFilterDto } from '../dto/filter-application.dto';
import { Pagination } from 'src/common/interfaces/pagination';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';
import { ApplicationStatus } from '../enums/application-status.enum';
import { APPLICATION_FILTERS_CONFIG } from '../constants/application-filters.config';

@Injectable()
export class ApplicationService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  public async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
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
      type: [
        ApplicationTypeEnum.DATA_PULLING,
        ApplicationTypeEnum.INDEPENDENT,
        ApplicationTypeEnum.SIMPLE,
        ApplicationTypeEnum.STANDALONE,
      ],
      status: [ApplicationStatus.ACTIVE, ApplicationStatus.DISABLED],
      ...options,
    };

    return this.applicationRepository.getManyPaginated(
      APPLICATION_FILTERS_CONFIG,
      paginationOptions,
    );
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
}
