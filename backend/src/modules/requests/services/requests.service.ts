import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationService } from 'src/modules/organization/services';
import { UserService } from 'src/modules/user/services/user.service';
import { CreateRequestDto } from '../dto/create-request.dto';
import { RequestRepository } from '../repositories/request.repository';
import { RequestStatus } from '../enums/request-status.enum';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import { Request } from '../entities/request.entity';
import { REQUEST_ERRORS } from '../constants/requests-errors.constants';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import {
  REQUEST_APP_ACCESS_FILTER_CONFIG,
  REQUEST_FILTER_CONFIG,
} from '../constants/request-filters.config';
import { RequestType } from '../enums/request-type.enum';
import { UserStatus } from 'src/modules/user/enums/user-status.enum';
import { CreateApplicationRequestDto } from '../dto/create-application-request.dto';
import { OngApplicationService } from 'src/modules/application/services/ong-application.service';
import { ApplicationService } from 'src/modules/application/services/application.service';
import { ApplicationStatus } from 'src/modules/application/enums/application-status.enum';
import { Pagination } from 'src/common/interfaces/pagination';
import { OngApplicationStatus } from 'src/modules/application/enums/ong-application-status.enum';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly ongApplicationService: OngApplicationService,
    private readonly applicationService: ApplicationService,
  ) {}

  public async findAll(options: BaseFilterDto) {
    const paginationOptions = {
      ...options,
      type: RequestType.CREATE_ORGANIZATION,
      status: RequestStatus.PENDING,
    };

    return this.requestRepository.getManyPaginated(
      REQUEST_FILTER_CONFIG,
      paginationOptions,
    );
  }

  public async findOneOrganizationRequest(id: number): Promise<Request> {
    const request = this.requestRepository.get({
      where: {
        id,
        status: RequestStatus.PENDING,
        type: RequestType.CREATE_ORGANIZATION,
      },
      relations: [
        'organization',
        'organization.organizationGeneral',
        'organization.organizationGeneral.city',
        'organization.organizationGeneral.county',
        'organization.organizationGeneral.contact',
        'organization.organizationActivity',
        'organization.organizationActivity.federations',
        'organization.organizationActivity.coalitions',
        'organization.organizationActivity.domains',
        'organization.organizationActivity.cities',
        'organization.organizationActivity.federations',
        'organization.organizationActivity.coalitions',
        'organization.organizationActivity.branches',
        'organization.organizationActivity.regions',
        'organization.organizationLegal',
        'organization.organizationLegal.legalReprezentative',
        'organization.organizationLegal.directors',
        'organization.organizationFinancial',
        'organization.organizationReport',
        'organization.organizationReport.reports',
        'organization.organizationReport.partners',
        'organization.organizationReport.investors',
      ],
    });

    if (!request) {
      throw new NotFoundException({
        ...REQUEST_ERRORS.GET.NOT_FOUND,
      });
    }

    return request;
  }

  public async createOrganizationRequest(createReqDto: CreateRequestDto) {
    // Check if the admin email is not in the user table already (is unique).
    const foundProfile = await this.userService.findOne({
      where: { email: createReqDto.admin.email },
    });

    if (foundProfile) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.CREATE.USER_EXISTS,
      });
    }

    // check if there is a user with those credentials
    const foundUser = await this.userService.findOne({
      where: [
        { email: createReqDto.admin.email },
        { phone: createReqDto.admin.phone },
      ],
    });

    if (foundUser) {
      // Check if there isn't already a request made by the same user.
      const foundRequest = await this.requestRepository.get({
        where: {
          userId: foundUser.id,
          status: RequestStatus.PENDING,
          type: RequestType.CREATE_ORGANIZATION,
        },
      });

      if (foundRequest) {
        throw new BadRequestException({
          ...REQUEST_ERRORS.CREATE.REQ_EXISTS,
        });
      }
    }

    try {
      const { organization, admin } = createReqDto;

      // 1. Create Organization
      const ong = await this.organizationService.create(organization);

      // 2. Create Admin for the organization
      const user = await this.userService.createAdmin({
        ...admin,
        status: UserStatus.PENDING,
        organizationId: ong.id,
      });

      return this.requestRepository.save({
        organizationId: ong.id,
        userId: user.id,
        type: RequestType.CREATE_ORGANIZATION,
      });
    } catch (error) {
      this.logger.error({ error, payload: createReqDto });
      throw error;
    }
  }

  public async approveOrganization(requestId: number) {
    // 1. Get the request
    const { organizationId, user, status, type, organization } =
      await this.findWithRelations(requestId);

    if (
      status !== RequestStatus.PENDING ||
      organization?.status !== OrganizationStatus.PENDING ||
      user?.status !== UserStatus.PENDING
    ) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.UPDATE.NOT_PENDING,
      });
    }

    if (type !== RequestType.CREATE_ORGANIZATION) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.UPDATE.WRONG_TYPE,
      });
    }

    // 2. Update organization status from PENDING to ACTIVE
    await this.organizationService.activate(organizationId);
    // 3. Activate the ADMIN user
    await this.userService.activateAdmin(user);
    // 4. Update the request status
    await this.requestRepository.update(
      { id: requestId },
      { status: RequestStatus.APPROVED },
    );

    // TODO 5. Send email with approval

    return this.findWithOrganization(requestId);
  }

  public async reject(requestId: number) {
    // 1. Check if request is pending
    const found = await this.requestRepository.get({
      where: { id: requestId },
    });

    if (found && found.status !== RequestStatus.PENDING) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.UPDATE.NOT_PENDING,
      });
    }

    // 2. Decline the request.
    await this.requestRepository.update(
      { id: requestId },
      { status: RequestStatus.DECLINED },
    );

    // TODO: 2. Send rejection by email

    return this.findWithOrganization(requestId);
  }

  public async createApplicationRequest(
    createApplicationRequestDto: CreateApplicationRequestDto,
  ): Promise<Request> {
    const { organizationId, applicationId } = createApplicationRequestDto;

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
    const request = await this.requestRepository.get({
      where: {
        organizationId,
        applicationId,
        status: RequestStatus.PENDING,
        type: RequestType.REQUEST_APPLICATION_ACCESS,
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
    const newOngApp = await this.ongApplicationService.create(
      organizationId,
      applicationId,
    );

    // 6. create pending request
    return this.requestRepository.save({
      organizationId,
      applicationId: newOngApp.id,
      type: RequestType.REQUEST_APPLICATION_ACCESS,
    });
  }

  public async getApplicationRequests(
    options: BaseFilterDto,
  ): Promise<Pagination<Request>> {
    const paginationOptions = {
      ...options,
      type: RequestType.REQUEST_APPLICATION_ACCESS,
      status: RequestStatus.PENDING,
    };

    return this.requestRepository.getManyPaginated(
      REQUEST_APP_ACCESS_FILTER_CONFIG,
      paginationOptions,
    );
  }

  public async findOneApplicationRequest(id: number): Promise<Request> {
    const request = this.requestRepository.get({
      where: {
        id,
        status: RequestStatus.PENDING,
        type: RequestType.REQUEST_APPLICATION_ACCESS,
      },
      relations: ['ongApplication', 'ongApplication.application'],
    });

    if (!request) {
      throw new NotFoundException({
        ...REQUEST_ERRORS.GET.NOT_FOUND,
      });
    }

    return request;
  }

  public async updateApplicationRequest(
    requestId: number,
    isApproved: boolean,
  ): Promise<Request> {
    const request = await this.findWithRelations(requestId);

    if (!request) {
      throw new NotFoundException({
        ...REQUEST_ERRORS.GET.NOT_FOUND,
      });
    }

    if (
      request.status !== RequestStatus.PENDING ||
      request.ongApplication.status !== OngApplicationStatus.PENDING
    ) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.UPDATE.NOT_PENDING,
      });
    }

    if (request.type !== RequestType.REQUEST_APPLICATION_ACCESS) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.UPDATE.WRONG_TYPE,
      });
    }

    // TODO: check what we want to do with the not restricted apps in this scenario
    await this.ongApplicationService.updateOne(request.applicationId, {
      status: isApproved
        ? OngApplicationStatus.ACTIVE
        : OngApplicationStatus.RESTRICTED,
    });

    await this.requestRepository.update(
      { id: requestId },
      { status: isApproved ? RequestStatus.APPROVED : RequestStatus.DECLINED },
    );

    return this.findWithApplication(requestId);
  }

  /**
   * PRIVATE METHODS
   */
  private findWithRelations(id: number): Promise<Request> {
    return this.requestRepository.get({
      where: { id },
      relations: ['organization', 'user', 'ongApplication'],
    });
  }

  private findWithOrganization(id: number): Promise<Request> {
    return this.requestRepository.get({
      where: { id },
      relations: ['organization'],
    });
  }

  private findWithApplication(id: number): Promise<Request> {
    return this.requestRepository.get({
      where: { id },
      relations: ['ongApplication'],
    });
  }
}
