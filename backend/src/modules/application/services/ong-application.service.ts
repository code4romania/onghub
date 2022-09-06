import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, UpdateResult } from 'typeorm';
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

  public async delete(
    applicationId: number,
    organizationId: number,
  ): Promise<{ success: boolean }> {
    const ongApplication = await this.ongApplicationRepository.get({
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

    try {
      await this.ongApplicationRepository.remove({ id: ongApplication.id });

      return { success: true };
    } catch (error) {
      this.logger.error({
        error: { error },
        ...ONG_APPLICATION_ERRORS.DELETE,
      });
      const err = error?.response;
      throw new BadRequestException({
        ...ONG_APPLICATION_ERRORS.DELETE,
        error: err,
      });
    }
  }

  public async restrict(
    applicationId: number,
    organizationId: number,
  ): Promise<{ success: boolean }> {
    const ongApplication = await this.ongApplicationRepository.get({
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

    try {
      await this.ongApplicationRepository.update(
        { id: ongApplication.id },
        { status: OngApplicationStatus.RESTRICTED },
      );

      return { success: true };
    } catch (error) {
      this.logger.error({
        error: { error },
        ...ONG_APPLICATION_ERRORS.RESTRICT,
      });
      const err = error?.response;
      throw new BadRequestException({
        ...ONG_APPLICATION_ERRORS.RESTRICT,
        error: err,
      });
    }
  }

  public async findOne(
    conditions: FindOneOptions<OngApplication>,
  ): Promise<OngApplication> {
    return this.ongApplicationRepository.get(conditions);
  }

  public async update(
    organizationId: number,
    applicationId: number,
    status: OngApplicationStatus,
  ): Promise<UpdateResult> {
    const ongApplication = await this.ongApplicationRepository.get({
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

    try {
      const result = await this.ongApplicationRepository.update(
        { organizationId, applicationId },
        { status },
      );

      return result;
    } catch (error) {
      this.logger.error({
        error: { error },
        ...ONG_APPLICATION_ERRORS.UPDATE,
      });
      const err = error?.response;
      throw new BadRequestException({
        ...ONG_APPLICATION_ERRORS.UPDATE,
        error: err,
      });
    }
  }
}
