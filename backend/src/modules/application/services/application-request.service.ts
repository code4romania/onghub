import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Pagination } from 'src/common/interfaces/pagination';
import { ApplicationStatus } from 'src/modules/application/enums/application-status.enum';
import { OngApplicationStatus } from 'src/modules/application/enums/ong-application-status.enum';
import { OngApplicationService } from 'src/modules/application/services/ong-application.service';
import { REQUEST_ERRORS } from '../../requests/constants/requests-errors.constants';
import { ApplicationRequestFilterDto } from '../dto/application-request-filters.dto';
import { ApplicationRequest } from '../entities/application-request.entity';
import { RequestStatus } from '../../../common/enums/request-status.enum';
import { ApplicationRequestRepository } from '../repositories/application-request.repository';
import { APPLICATION_REQUEST_FILTERS_CONFIG } from '../constants/application-filters.config';
import { ApplicationRepository } from '../repositories/application.repository';

@Injectable()
export class ApplicationRequestService {
  private readonly logger = new Logger(ApplicationRequestService.name);
  constructor(
    private readonly applicationRequestRepository: ApplicationRequestRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly ongApplicationService: OngApplicationService,
  ) {}

  public async create(
    organizationId: number,
    applicationId: number,
  ): Promise<ApplicationRequest> {
    // 1. check if application is active
    const application = await this.applicationRepository.get({
      where: { id: applicationId },
    });

    if (application.status !== ApplicationStatus.ACTIVE) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.CREATE.APPLICATION_STATUS,
      });
    }

    // 2. check if there is aleady an pending request for
    const request = await this.applicationRequestRepository.get({
      where: {
        organizationId,
        applicationId,
        status: RequestStatus.PENDING,
      },
    });

    if (request) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.CREATE.REQ_EXISTS,
      });
    }

    // 3. Check if the app is aleady assigned to the organization (either restricted or otherwise)
    const ongApp = await this.ongApplicationService.findOne({
      where: { organizationId, applicationId },
    });

    if (ongApp) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.CREATE.APP_EXISTS,
      });
    }

    // 4. create request app
    await this.ongApplicationService.create(organizationId, applicationId);

    // 5. create pending request
    return this.applicationRequestRepository.save({
      organizationId,
      applicationId,
    });
  }

  public async findAll(
    options: ApplicationRequestFilterDto,
  ): Promise<Pagination<ApplicationRequest>> {
    const paginationOptions = {
      ...options,
    };

    return this.applicationRequestRepository.getManyPaginated(
      APPLICATION_REQUEST_FILTERS_CONFIG,
      paginationOptions,
    );
  }

  public async approve(requestId: number): Promise<{ success: boolean }> {
    const request = await this.applicationRequestRepository.get({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException({
        ...REQUEST_ERRORS.GET.NOT_FOUND,
      });
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.UPDATE.NOT_PENDING,
      });
    }

    await this.ongApplicationService.update(
      request.organizationId,
      request.applicationId,
      OngApplicationStatus.ACTIVE,
    );

    await this.applicationRequestRepository.update(
      { id: requestId },
      { status: RequestStatus.APPROVED },
    );

    return { success: true };
  }

  public async reject(requestId: number): Promise<{ success: boolean }> {
    const request = await this.applicationRequestRepository.get({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException({
        ...REQUEST_ERRORS.GET.NOT_FOUND,
      });
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.UPDATE.NOT_PENDING,
      });
    }

    await this.ongApplicationService.update(
      request.organizationId,
      request.applicationId,
      OngApplicationStatus.RESTRICTED,
    );

    await this.applicationRequestRepository.update(
      { id: requestId },
      { status: RequestStatus.DECLINED },
    );

    return { success: true };
  }

  public async abandon(
    applicationId: number,
    organizationId: number,
  ): Promise<{ success: boolean }> {
    const request = await this.applicationRequestRepository.get({
      where: { applicationId, organizationId },
    });

    if (!request) {
      throw new NotFoundException({
        ...REQUEST_ERRORS.GET.NOT_FOUND,
      });
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.UPDATE.NOT_PENDING,
      });
    }

    await this.ongApplicationService.delete(
      request.applicationId,
      organizationId,
    );

    await this.applicationRequestRepository.remove({ id: request.id });

    return { success: true };
  }
}
