import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, In, UpdateResult } from 'typeorm';
import { ONG_APPLICATION_ERRORS } from '../constants/application-error.constants';
import { OngApplication } from '../entities/ong-application.entity';
import { OngApplicationStatus } from '../enums/ong-application-status.enum';
import { OngApplicationRepository } from '../repositories/ong-application.repository';

@Injectable()
export class OngApplicationService {
  private readonly logger = new Logger(OngApplicationService.name);
  constructor(
    private readonly ongApplicationRepository: OngApplicationRepository,
  ) {}

  public async create(
    organizationId: number,
    applicationId: number,
  ): Promise<OngApplication> {
    try {
      const ongApp = await this.ongApplicationRepository.save({
        organizationId,
        applicationId,
      });

      return ongApp;
    } catch (error) {
      this.logger.error({ error: { error }, ...ONG_APPLICATION_ERRORS.CREATE });
      const err = error?.response;
      throw new BadRequestException({
        ...ONG_APPLICATION_ERRORS.CREATE,
        error: err,
      });
    }
  }

  public async findOne(
    conditions: FindOneOptions<OngApplication>,
  ): Promise<OngApplication> {
    return this.ongApplicationRepository.get(conditions);
  }

  public async findMyOngApplications(
    organizationId: number,
  ): Promise<OngApplication[]> {
    return this.ongApplicationRepository.getMany({
      where: {
        organizationId,
        status: In([OngApplicationStatus.ACTIVE, OngApplicationStatus.PENDING]),
      },
      relations: ['application'],
    });
  }

  public async findById(
    id: number,
    organizationId: number,
  ): Promise<OngApplication> {
    const application = await this.ongApplicationRepository.get({
      where: {
        id,
        organizationId,
        status: In([OngApplicationStatus.ACTIVE, OngApplicationStatus.PENDING]),
      },
      relations: ['application'],
    });

    if (!application) {
      throw new NotFoundException({
        ...ONG_APPLICATION_ERRORS.GET.NOT_FOUND,
      });
    }

    return application;
  }

  public async updateOne(
    id: number,
    updates: Partial<OngApplication>,
  ): Promise<UpdateResult> {
    return this.ongApplicationRepository.update({ id }, updates);
  }
}
