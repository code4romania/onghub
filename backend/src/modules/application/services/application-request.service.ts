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
import { ApplicationRequestFilterDto } from '../dto/application-request-filters.dto';
import { ApplicationRequest } from '../entities/application-request.entity';
import { RequestStatus } from '../../organization/enums/request-status.enum';
import { ApplicationRequestRepository } from '../repositories/application-request.repository';
import { APPLICATION_REQUEST_FILTERS_CONFIG } from '../constants/application-filters.config';
import { ApplicationRepository } from '../repositories/application.repository';
import {
  APPLICATION_ERRORS,
  APPLICATION_REQUEST_ERRORS,
} from '../constants/application-error.constants';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';
import { FileManagerService } from 'src/shared/services/file-manager.service';
import { OrganizationApplicationRequest } from '../interfaces/organization-application-request.interface';

@Injectable()
export class ApplicationRequestService {
  private readonly logger = new Logger(ApplicationRequestService.name);
  constructor(
    private readonly applicationRequestRepository: ApplicationRequestRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly ongApplicationService: OngApplicationService,
    private readonly fileManagerService: FileManagerService,
  ) {}

  public async create(
    organizationId: number,
    applicationId: number,
  ): Promise<void> {
    // 1. check if application is active
    const application = await this.applicationRepository.get({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException(APPLICATION_ERRORS.GET);
    }

    if (application.status !== ApplicationStatus.ACTIVE) {
      throw new BadRequestException({
        ...APPLICATION_REQUEST_ERRORS.CREATE.APPLICATION_STATUS,
      });
    }

    if (application.type === ApplicationTypeEnum.INDEPENDENT) {
      throw new BadRequestException({
        ...APPLICATION_REQUEST_ERRORS.CREATE.APPLICATION_TYPE,
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
        ...APPLICATION_REQUEST_ERRORS.CREATE.REQ_EXISTS,
      });
    }

    // 3. Check if the app is aleady assigned to the organization (either restricted or otherwise)
    const ongApp = await this.ongApplicationService.findOne({
      where: { organizationId, applicationId },
    });

    if (ongApp) {
      throw new BadRequestException({
        ...APPLICATION_REQUEST_ERRORS.CREATE.APP_EXISTS,
      });
    }

    // 4. create request app - only for STANDALONE app the status is pending, the rest are active by default
    await this.ongApplicationService.create(
      organizationId,
      applicationId,
      application.type === ApplicationTypeEnum.STANDALONE
        ? OngApplicationStatus.PENDING
        : OngApplicationStatus.ACTIVE,
    );

    if (application.type !== ApplicationTypeEnum.STANDALONE) {
      return;
    }

    try {
      // 5. create pending request
      await this.applicationRequestRepository.save({
        organizationId,
        applicationId,
      });
    } catch (error) {
      this.logger.error({
        error: { error },
        ...APPLICATION_REQUEST_ERRORS.CREATE.REQUEST,
      });
      const err = error?.response;
      throw new BadRequestException({
        ...APPLICATION_REQUEST_ERRORS.CREATE.REQUEST,
        error: err,
      });
    }
  }

  public async findAll(
    options: ApplicationRequestFilterDto,
  ): Promise<Pagination<ApplicationRequest>> {
    const paginationOptions = {
      ...options,
      status: RequestStatus.PENDING,
    };

    return this.applicationRequestRepository.getManyPaginated(
      APPLICATION_REQUEST_FILTERS_CONFIG,
      paginationOptions,
    );
  }

  public async findRequestsByOrganizationId(
    organizationId: number,
  ): Promise<OrganizationApplicationRequest[]> {
    const applicationRequests = await this.applicationRequestRepository
      .getQueryBuilder()
      .select([
        'application-request.id as id',
        'application.logo as logo',
        'application.name as name',
        'application-request.created_on as createdOn',
      ])
      .leftJoin(
        'application',
        'application',
        'application.id = application-request.applicationId',
      )
      .where('application-request.organizationId = :organizationId', {
        organizationId,
      })
      .andWhere('application-request.status = :status', {
        status: RequestStatus.PENDING,
      })
      .execute();

    return this.fileManagerService.mapLogoToEntity<OrganizationApplicationRequest>(
      applicationRequests,
    );
  }

  public async approve(requestId: number): Promise<void> {
    const request = await this.applicationRequestRepository.get({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException(APPLICATION_REQUEST_ERRORS.GET.NOT_FOUND);
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException(
        APPLICATION_REQUEST_ERRORS.UPDATE.NOT_PENDING,
      );
    }

    await this.ongApplicationService.update(
      request.organizationId,
      request.applicationId,
      OngApplicationStatus.ACTIVE,
    );

    await this.update(requestId, RequestStatus.APPROVED);
  }

  public async reject(requestId: number): Promise<void> {
    const request = await this.applicationRequestRepository.get({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException({
        ...APPLICATION_REQUEST_ERRORS.GET.NOT_FOUND,
      });
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException({
        ...APPLICATION_REQUEST_ERRORS.UPDATE.NOT_PENDING,
      });
    }

    await this.ongApplicationService.delete(
      request.applicationId,
      request.organizationId,
    );

    await this.update(requestId, RequestStatus.DECLINED);
  }

  public async abandon(
    applicationId: number,
    organizationId: number,
  ): Promise<void> {
    const request = await this.applicationRequestRepository.get({
      where: { applicationId, organizationId, status: RequestStatus.PENDING },
    });

    if (!request) {
      throw new NotFoundException({
        ...APPLICATION_REQUEST_ERRORS.GET.NOT_FOUND,
      });
    }

    await this.ongApplicationService.delete(
      request.applicationId,
      organizationId,
    );

    await this.delete(request.id);
  }

  private async update(
    requestId: number,
    status: RequestStatus,
  ): Promise<void> {
    try {
      await this.applicationRequestRepository.update(
        { id: requestId },
        { status },
      );
    } catch (error) {
      this.logger.error({
        error: { error },
        ...APPLICATION_REQUEST_ERRORS.UPDATE.REQUEST,
      });
      const err = error?.response;
      throw new BadRequestException({
        ...APPLICATION_REQUEST_ERRORS.UPDATE.REQUEST,
        error: err,
      });
    }
  }

  private async delete(requestId: number): Promise<void> {
    try {
      await this.applicationRequestRepository.remove({ id: requestId });
    } catch (error) {
      this.logger.error({
        error: { error },
        ...APPLICATION_REQUEST_ERRORS.DELETE,
      });
      const err = error?.response;
      throw new BadRequestException({
        ...APPLICATION_REQUEST_ERRORS.DELETE,
        error: err,
      });
    }
  }
}
