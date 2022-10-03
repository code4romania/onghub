import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import { OrganizationService } from 'src/modules/organization/services';
import { UserService } from 'src/modules/user/services/user.service';
import { CreateOrganizationRequestDto } from '../dto/create-organization-request.dto';
import { OrganizationRequest } from '../entities/organization-request.entity';
import { RequestStatus } from '../enums/request-status.enum';
import { OrganizationRequestRepository } from '../repositories/organization-request.repository';
import { ORGANIZATION_REQUEST_FILTER_CONFIG } from '../constants/organization-filter.config';
import { ORGANIZATION_REQUEST_ERRORS } from '../constants/errors.constants';
import { MailService } from 'src/mail/services/mail.service';
import { MAIL_TEMPLATES } from 'src/mail/enums/mail.enum';
import { Role } from 'src/modules/user/enums/role.enum';
import { MAIL_ERRORS } from 'src/mail/constants/errors.constants';

@Injectable()
export class OrganizationRequestService {
  private readonly logger = new Logger(OrganizationRequestService.name);

  constructor(
    private readonly organizationRequestRepository: OrganizationRequestRepository,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  public async findAll(options: BaseFilterDto) {
    const paginationOptions = {
      ...options,
      status: RequestStatus.PENDING,
    };

    return this.organizationRequestRepository.getManyPaginated(
      ORGANIZATION_REQUEST_FILTER_CONFIG,
      paginationOptions,
    );
  }

  public async findOne(id: number): Promise<OrganizationRequest> {
    const request = this.organizationRequestRepository.get({
      where: {
        id,
        status: RequestStatus.PENDING,
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
        ...ORGANIZATION_REQUEST_ERRORS.GET.NOT_FOUND,
      });
    }

    return request;
  }

  public async create(createReqDto: CreateOrganizationRequestDto) {
    // Check if the admin email is not in the user table already (is unique).
    const foundProfile = await this.userService.findOne({
      where: { email: createReqDto.admin.email },
    });

    if (foundProfile) {
      throw new BadRequestException({
        ...ORGANIZATION_REQUEST_ERRORS.CREATE.USER_EXISTS,
      });
    }

    // Check if there isn't already a request made by the same user.
    const foundRequest = await this.organizationRequestRepository.get({
      where: [
        { email: createReqDto.admin.email, status: RequestStatus.PENDING },
        { phone: createReqDto.admin.phone, status: RequestStatus.PENDING },
      ],
    });

    if (foundRequest) {
      throw new BadRequestException({
        ...ORGANIZATION_REQUEST_ERRORS.CREATE.REQ_EXISTS,
      });
    }

    try {
      const organization = await this.organizationService.create(
        createReqDto.organization,
      );

      // Mail notifications
      // Admin
      this.mailService.sendEmail({
        to: createReqDto.admin.email,
        template: MAIL_TEMPLATES.CREATE_ORGANIZATION_ADMIN,
      });

      // Super-Admin
      const superAdmin = await this.userService.findMany({
        where: { role: Role.SUPER_ADMIN },
      });
      const emailSAdmins = superAdmin.map((item) => {
        return item.email;
      });
      this.mailService.sendEmail({
        to: emailSAdmins,
        template: MAIL_TEMPLATES.CREATE_ORGANIZATION_SUPER,
      });

      return this.organizationRequestRepository.save({
        name: createReqDto.admin.name,
        email: createReqDto.admin.email,
        phone: createReqDto.admin.phone,
        organizationName: createReqDto.organization.general.name,
        organizationId: organization.id,
      });
    } catch (error) {
      this.logger.error({ error, payload: createReqDto });
      throw error;
    }
  }

  public async approve(requestId: number) {
    // 1. Get the request
    const { organizationId, email, phone, name, status, organization } =
      await this.find(requestId);

    if (status !== RequestStatus.PENDING) {
      throw new BadRequestException({
        ...ORGANIZATION_REQUEST_ERRORS.UPDATE.NOT_PENDING,
      });
    }

    if (organization?.status !== OrganizationStatus.PENDING) {
      throw new BadRequestException({
        ...ORGANIZATION_REQUEST_ERRORS.UPDATE.NOT_PENDING,
      });
    }

    // 2. Update organization status from PENDING to ACTIVE
    await this.organizationService.activate(organizationId);
    // 3. Create the ADMIN user
    await this.userService.createAdmin({ email, phone, name, organizationId });
    // 4. Update the request status
    await this.update(requestId, RequestStatus.APPROVED);
    // 5. Send email with approval
    this.mailService.sendEmail({
      to: email,
      template: MAIL_TEMPLATES.ORGANIZATION_REQUEST_APPROVAL,
    });

    return this.find(requestId);
  }

  public async reject(requestId: number) {
    // 1. Check if request is pending
    const found = await this.find(requestId);

    if (found && found.status !== RequestStatus.PENDING) {
      throw new BadRequestException({
        ...ORGANIZATION_REQUEST_ERRORS.UPDATE.NOT_PENDING,
      });
    }

    // 2. Delete pending organization
    await this.organizationService.delete(found.organizationId);

    // 3. Decline the request.
    await this.update(requestId, RequestStatus.DECLINED);

    // 4. Send rejection by email
    this.mailService.sendEmail({
      to: found.email,
      template: MAIL_TEMPLATES.ORGANIZATION_REQUEST_REJECTION,
    });

    return this.find(requestId);
  }

  public async sendRestrictRequest(organizationId: number): Promise<void> {
    try {
      const organization = await this.organizationService.findWithUsers(
        organizationId,
      );
      const superAdmins = await this.userService.findMany({
        where: { role: Role.SUPER_ADMIN },
      });
      const emailSAdmins = superAdmins.map((item) => {
        return item.email;
      });

      await this.mailService.sendEmail({
        to: emailSAdmins,
        template: MAIL_TEMPLATES.RESTRICT_ORGANIZATION_SUPER,
        context: {
          orgName: organization.organizationGeneral.name,
        },
      });
    } catch (error) {
      this.logger.error({
        error: { error },
        ...MAIL_ERRORS.RESTRICT_SADMINS,
      });
      throw error;
    }
  }

  private find(id: number): Promise<OrganizationRequest> {
    return this.organizationRequestRepository.get({
      where: { id },
      relations: ['organization'],
    });
  }

  private async update(
    requestId: number,
    status: RequestStatus,
  ): Promise<void> {
    try {
      await this.organizationRequestRepository.update(
        { id: requestId },
        { status },
      );
    } catch (error) {
      this.logger.error({
        error: { error },
        ...ORGANIZATION_REQUEST_ERRORS.UPDATE.REQUEST,
      });
      const err = error?.response;
      throw new BadRequestException({
        ...ORGANIZATION_REQUEST_ERRORS.UPDATE.REQUEST,
        error: err,
      });
    }
  }
}
