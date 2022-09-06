import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Pagination } from 'src/common/interfaces/pagination';
import { ApplicationStatus } from 'src/modules/application/enums/application-status.enum';
import { OngApplicationStatus } from 'src/modules/application/enums/ong-application-status.enum';
import { ApplicationService } from 'src/modules/application/services/application.service';
import { OngApplicationService } from 'src/modules/application/services/ong-application.service';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import { OrganizationService } from 'src/modules/organization/services';
import { REQUEST_APP_ACCESS_FILTER_CONFIG } from '../constants/request-filters.config';
import { REQUEST_ERRORS } from '../constants/requests-errors.constants';
import { ApplicationRequestFilterDto } from '../dto/application-request-filters.dto';
import { ApplicationRequest } from '../entities/application-request.entity';
import { RequestStatus } from '../enums/request-status.enum';
import { RequestType } from '../enums/request-type.enum';
import { ApplicationRequestRepository } from '../repositories/application-request.repository';

@Injectable()
export class ApplicationRequestService {
  private readonly logger = new Logger(ApplicationRequestService.name);

  constructor(
    private readonly applicationRequestRepository: ApplicationRequestRepository,
    private readonly organizationService: OrganizationService,
    private readonly applicationService: ApplicationService,
    private readonly ongApplicationService: OngApplicationService,
  ) {}

  public async create(
    organizationId: number,
    applicationId: number,
  ): Promise<ApplicationRequest> {
    // 1. check if organization is active
    const organization = await this.organizationService.find(organizationId);

    if (organization.status !== OrganizationStatus.ACTIVE) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.CREATE.ORGANIZATION_STATUS,
      });
    }

    // 2. check if application is active
    const application = await this.applicationService.findOne(applicationId);

    if (application.status !== ApplicationStatus.ACTIVE) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.CREATE.APPLICATION_STATUS,
      });
    }

    // 3. check if there is aleady an pending request for
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

    // 4. Check if the app is aleady assigned to the organization (either restricted or otherwise)
    const ongApp = await this.ongApplicationService.findOne({
      where: { organizationId, applicationId },
    });

    if (ongApp) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.CREATE.APP_EXISTS,
      });
    }

    // 5. create request app
    await this.ongApplicationService.create(organizationId, applicationId);

    // 6. create pending request
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
      type: RequestType.REQUEST_APPLICATION_ACCESS,
    };

    return this.applicationRequestRepository.getManyPaginated(
      REQUEST_APP_ACCESS_FILTER_CONFIG,
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

    // TODO: check what we want to do with the not restricted apps in this scenario
    // await this.ongApplicationService.udpate(request.applicationId, {
    //   status: isApproved
    //     ? OngApplicationStatus.ACTIVE
    //     : OngApplicationStatus.RESTRICTED,
    // });

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

    // TODO: check what we want to do with the not restricted apps in this scenario
    // await this.ongApplicationService.udpate(request.applicationId, {
    //   status: isApproved
    //     ? OngApplicationStatus.ACTIVE
    //     : OngApplicationStatus.RESTRICTED,
    // });

    await this.applicationRequestRepository.update(
      { id: requestId },
      { status: RequestStatus.DECLINED },
    );

    return { success: true };
  }

  public async abandon(
    requestId: number,
    organizationId: number,
  ): Promise<{ success: boolean }> {
    const request = await this.applicationRequestRepository.get({
      where: { id: requestId, organizationId },
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

    await this.ongApplicationService.delete({
      organizationId,
      applicationId: request.applicationId,
      status: OngApplicationStatus.PENDING,
    });

    await this.applicationRequestRepository.update(
      { id: requestId },
      { status: RequestStatus.DECLINED },
    );

    return { success: true };
  }
}
