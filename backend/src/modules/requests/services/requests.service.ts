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
    };

    return this.requestRepository.getManyPaginated(
      REQUEST_FILTER_CONFIG,
      paginationOptions,
    );
  }

  public async create(createReqDto: CreateRequestDto) {
    // Check if the admin email is not in the user table already (is unique).
    const foundProfile = await this.userService.findOne({
      where: { email: createReqDto.admin.email },
    });

    if (foundProfile) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.CREATE.USER_EXISTS,
      });
    }

    // Check if there isn't already a request made by the same user.
    const foundRequest = await this.requestRepository.get({
      where: [
        { email: createReqDto.admin.email, status: RequestStatus.PENDING },
        { phone: createReqDto.admin.phone, status: RequestStatus.PENDING },
      ],
    });

    if (foundRequest) {
      throw new BadRequestException({
        ...REQUEST_ERRORS.CREATE.REQ_EXISTS,
      });
    }

    try {
      const organization = await this.organizationService.create(
        createReqDto.organization,
      );

      return this.requestRepository.save({
        name: createReqDto.admin.name,
        email: createReqDto.admin.email,
        phone: createReqDto.admin.phone,
        organizationId: organization.id,
      });
    } catch (error) {
      this.logger.error({ error, payload: createReqDto });
      throw error;
    }
  }

  private find(id: number): Promise<Request> {
    return this.requestRepository.get({
      where: { id },
      relations: ['organization'],
    });
  }

  public async approve(requestId: number) {
    // 1. Get the request
    const { organizationId, email, phone, name, status, organization } =
      await this.find(requestId);

    if (status !== RequestStatus.PENDING) {
      // TODO: Add errors and throw the correct one
      throw new Error('The request is not PENDING');
    }

    if (organization?.status !== OrganizationStatus.PENDING) {
      // TODO: Add errors and throw the correct one
      throw new Error('The organizaton status is not PENDING');
    }

    // 2. Update organization status from PENDING to ACTIVE
    await this.organizationService.activate(organizationId);
    // 3. Create the ADMIN user
    await this.userService.createAdmin({ email, phone, name, organizationId });
    // 4. Update the request status
    await this.requestRepository.update(
      { id: requestId },
      { status: RequestStatus.APPROVED },
    );
    // TODO 5. Send email with approval

    return this.find(requestId);
  }

  public async reject(requestId: number) {
    // 1. Decline the request
    await this.requestRepository.update(
      { id: requestId },
      { status: RequestStatus.DECLINED },
    );

    // TODO: 2. Send rejection by email

    return this.find(requestId);
  }
}
