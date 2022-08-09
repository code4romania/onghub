import { Injectable } from '@nestjs/common';
import { OrganizationService } from 'src/modules/organization/services';
import { UserService } from 'src/modules/user/services/user.service';
import { CreateRequestDto } from '../dto/create-request.dto';
import { RequestRepository } from '../repositories/request.repository';
import { RequestStatus } from '../enums/request-status.enum';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import { Request } from '../entities/request.entity';

@Injectable()
export class RequestsService {
  constructor(
    private requestRepository: RequestRepository,
    private organizationService: OrganizationService,
    private userService: UserService,
  ) {}

  public create(createReqDto: CreateRequestDto) {
    // TODO: validate DTO to have unique values for the admin (email, phone) using custom decorators (ask Cosmin)
    return this.requestRepository.save(createReqDto);
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
