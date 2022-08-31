import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { OrganizationService } from 'src/modules/organization/services';
import { UserService } from 'src/modules/user/services/user.service';
import { CreateRequestDto } from '../dto/create-request.dto';
import { RequestRepository } from '../repositories/request.repository';
import { RequestStatus } from '../enums/request-status.enum';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import { Request } from '../entities/request.entity';
import { REQUEST_ERRORS } from '../constants/requests-errors.constants';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { REQUEST_FILTER_CONFIG } from '../constants/request-filters.config';
import { RequestType } from '../enums/request-type.enum';
import { UserStatus } from 'src/modules/user/enums/user-status.enum';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);
  constructor(
    private requestRepository: RequestRepository,
    private organizationService: OrganizationService,
    private userService: UserService,
  ) {}

  public async findAll(options: BaseFilterDto) {
    const paginationOptions = {
      ...options,
      status: RequestStatus.PENDING,
    };

    return this.requestRepository.getManyPaginated(
      REQUEST_FILTER_CONFIG,
      paginationOptions,
    );
  }

  public async findOneOrganizationRequest(id: number): Promise<Request> {
    return this.requestRepository.get({
      where: { id, status: RequestStatus.PENDING },
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
    const { organizationId, user, status, organization } =
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

  /**
   * PRIVATE METHODS
   */
  private findWithRelations(id: number): Promise<Request> {
    return this.requestRepository.get({
      where: { id },
      relations: ['organization', 'user'],
    });
  }

  private findWithOrganization(id: number): Promise<Request> {
    return this.requestRepository.get({
      where: { id },
      relations: ['organization'],
    });
  }
}
