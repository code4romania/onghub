import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ApplicationRepository } from '../repositories/application.repository';
import { Application } from '../entities/application.entity';
import {
  HTTP_ERRORS_MESSAGES,
  ERROR_CODES,
} from 'src/modules/organization/constants/errors.constants';
import { UpdateApplicationDto } from '../dto/update-application.dto';

@Injectable()
export class ApplicationService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  public async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    const { type, ...createApplicationData } = createApplicationDto;
    return this.applicationRepository.save({
      type,
      ...createApplicationData,
    });
  }

  public async findOne(id: number): Promise<Application> {
    const application = await this.applicationRepository.get({
      where: { id },
      relations: ['type'],
    });

    if (!application) {
      throw new NotFoundException({
        message: HTTP_ERRORS_MESSAGES.APPLICATION,
        errorCode: ERROR_CODES.APP001,
      });
    }

    return application;
  }
}
