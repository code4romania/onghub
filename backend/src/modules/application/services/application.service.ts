import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ApplicationRepository } from '../repositories/application.repository';
import { Application } from '../entities/application.entity';
import {
  APPLICATION_HTTP_ERRORS_MESSAGES,
  APPLICATION_ERROR_CODES,
} from '../constants/application-error.constants';
import { NomenclaturesService } from 'src/shared/services/nomenclatures.service';
import { UpdateApplicationDto } from '../dto/update-application.dto';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly nomenclaturesService: NomenclaturesService,
  ) {}

  public async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    const type = await this.nomenclaturesService.getAppType({
      where: { id: createApplicationDto.typeId },
    });

    return this.applicationRepository.save({
      ...createApplicationDto,
      type,
    });
  }

  public async findOne(id: number): Promise<Application> {
    const application = await this.applicationRepository.get({
      where: { id },
      relations: ['type'],
    });

    if (!application) {
      throw new NotFoundException({
        message: APPLICATION_HTTP_ERRORS_MESSAGES.APPLICATION,
        errorCode: APPLICATION_ERROR_CODES.APP001,
      });
    }

    return application;
  }

  public async findAll(conditions: FindManyOptions<Application>) {
    return this.applicationRepository.getMany(conditions);
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
