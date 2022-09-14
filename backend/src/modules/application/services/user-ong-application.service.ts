import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';
import { USER_ONG_APPLICATION_ERRORS } from '../constants/application-error.constants';
import { UserOngApplication } from '../entities/user-ong-application.entity';
import { UserOngApplicationRepository } from '../repositories/user-ong-application.repository';
import { OngApplicationService } from './ong-application.service';

@Injectable()
export class UserOngApplicationService {
  private readonly logger = new Logger(UserOngApplicationService.name);
  constructor(
    private readonly userOngApplicationRepository: UserOngApplicationRepository,
    private readonly ongApplicationService: OngApplicationService,
  ) {}

  public async create(
    organizationId: number,
    applicationId: number,
    userId: number,
  ): Promise<UserOngApplication> {
    const ongApplication = await this.ongApplicationService.findOne({
      where: { organizationId, applicationId },
    });

    if (!ongApplication) {
      throw new NotFoundException(USER_ONG_APPLICATION_ERRORS.GET.NOT_FOUND);
    }

    return this.userOngApplicationRepository.save({
      applicationId: ongApplication.id,
      userId,
    });
  }

  public async createMany(
    organizationId: number,
    applicationIds: number[],
    userId: number,
  ): Promise<UserOngApplication[]> {
    const ongApplications = await this.ongApplicationService.findMany({
      where: { organizationId, applicationId: In(applicationIds) },
    });

    const valuesToInsert = ongApplications.map((app) => ({
      applicationId: app.id,
      organizationId,
      userId,
    }));

    return this.userOngApplicationRepository.saveMany(valuesToInsert);
  }
}
