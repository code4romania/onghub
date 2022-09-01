import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { ONG_APPLICATION_ERRORS } from '../constants/application-error.constants';
import { OngApplication } from '../entities/ong-application.entity';
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
}
