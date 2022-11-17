import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { MAIL_OPTIONS } from 'src/mail/constants/template.constants';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import { OrganizationService } from 'src/modules/organization/services';
import { UserService } from 'src/modules/user/services/user.service';
import { FileManagerService } from 'src/shared/services/file-manager.service';
import { CreateOrganizationRequestDto } from '../dto/create-organization-request.dto';
import { OrganizationRequest } from '../entities/organization-request.entity';
import { RequestStatus } from '../enums/request-status.enum';
import { OrganizationRequestRepository } from '../repositories/organization-request.repository';
import { ORGANIZATION_REQUEST_FILTER_CONFIG } from '../constants/organization-filter.config';
import { ORGANIZATION_REQUEST_ERRORS } from '../constants/errors.constants';
import { MailService } from 'src/mail/services/mail.service';
import { Role } from 'src/modules/user/enums/role.enum';
import { FindManyOptions } from 'typeorm';
import { MAIL_ERRORS } from 'src/mail/constants/errors.constants';

@Injectable()
export class OrganizationRequestService {
  private readonly logger = new Logger(OrganizationRequestService.name);

  constructor(
    private readonly organizationRequestRepository: OrganizationRequestRepository,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly fileManagerService: FileManagerService,
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
    const request = await this.organizationRequestRepository.get({
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

    // check for logo and add public url
    if (request.organization.organizationGeneral.logo) {
      const logo = await this.fileManagerService.generatePresignedURL(
        request.organization.organizationGeneral.logo,
      );
      request.organization.organizationGeneral.logo = logo;
    }

    // check for logo and add public url
    if (request.organization.organizationLegal.organizationStatute) {
      const organizationStatute =
        await this.fileManagerService.generatePresignedURL(
          request.organization.organizationLegal.organizationStatute,
        );
      request.organization.organizationLegal.organizationStatute =
        organizationStatute;
    }

    return request;
  }

  public async validate(
    createRequestDto: Partial<CreateOrganizationRequestDto>,
  ): Promise<any[]> {
    const { admin, organization } = createRequestDto;
    const errors = [];

    // 1. validate admin
    if (admin) {
      const user = await this.userService.findOne({
        where: [{ email: admin.email }, { phone: admin.phone }],
      });

      if (user) {
        errors.push(
          new BadRequestException(
            ORGANIZATION_REQUEST_ERRORS.CREATE.USER_EXISTS,
          ),
        );
      }
    }

    // 2. validate organization
    if (organization) {
      // 2.1 validate organization general
      if (organization.general) {
        const { cui, rafNumber, name, email, phone, alias } =
          organization.general;

        errors.push(
          ...(await this.organizationService.validateOrganizationGeneral(
            cui,
            rafNumber,
            name,
            email,
            phone,
            alias,
          )),
        );
      }
    }

    if (errors.length) {
      throw new BadRequestException(errors);
    } else {
      return [];
    }
  }

  public async create(
    createReqDto: CreateOrganizationRequestDto,
    logo: Express.Multer.File[],
    organizationStatute: Express.Multer.File[],
  ) {
    // 1. Check if the admin email is not in the user table already (is unique).
    const foundProfile = await this.userService.findOne({
      where: { email: createReqDto.admin.email },
    });

    // 2. There is already and admin with the email address
    if (foundProfile) {
      throw new BadRequestException({
        ...ORGANIZATION_REQUEST_ERRORS.CREATE.USER_EXISTS,
      });
    }

    // 3. Check if there isn't already a request made by the same user.
    const foundRequest = await this.organizationRequestRepository.get({
      where: [
        { email: createReqDto.admin.email, status: RequestStatus.PENDING },
        { phone: createReqDto.admin.phone, status: RequestStatus.PENDING },
      ],
    });

    // 4. Throw error for duplicate request
    if (foundRequest) {
      throw new BadRequestException({
        ...ORGANIZATION_REQUEST_ERRORS.CREATE.REQ_EXISTS,
      });
    }

    // 5. create organization
    const organization = await this.organizationService.create(
      createReqDto.admin,
      createReqDto.organization,
      logo,
      organizationStatute,
    );

    try {
      // 6. Send email for Super amdin and admin with successful creation
      const adminMailOptions: {
        template: string;
        subject: string;
        context: { title: string };
      } = MAIL_OPTIONS.ORGANIZATION_CREATE_ADMIN;

      await this.mailService.sendEmail({
        to: createReqDto.admin.email,
        template: adminMailOptions.template,
        subject: adminMailOptions.subject,
        context: {
          title: adminMailOptions.context.title,
          subtitle: MAIL_OPTIONS.ORGANIZATION_CREATE_ADMIN.context.subtitle(),
        },
      });

      // 7. create request
      const request = await this.organizationRequestRepository.save({
        name: createReqDto.admin.name,
        email: createReqDto.admin.email,
        phone: createReqDto.admin.phone,
        organizationName: createReqDto.organization.general.name,
        organizationId: organization.id,
        logo: organization.organizationGeneral.logo,
      });

      // 8. Send emails for Super-Admin
      const superAdmins = await this.userService.findMany({
        where: { role: Role.SUPER_ADMIN },
      });

      const superadminMailOptions: {
        template: string;
        subject: string;
        context: { title: string };
      } = MAIL_OPTIONS.ORGANIZATION_CREATE_SUPERADMIN;

      await this.mailService.sendEmail({
        to: superAdmins.map((item) => item.email),
        template: superadminMailOptions.template,
        subject: superadminMailOptions.subject,
        context: {
          title: superadminMailOptions.context.title,
          subtitle:
            MAIL_OPTIONS.ORGANIZATION_CREATE_SUPERADMIN.context.subtitle(),
          cta: {
            link: MAIL_OPTIONS.ORGANIZATION_CREATE_SUPERADMIN.context.cta.link(
              request.id.toString(),
            ),
            label: '',
          },
        },
      });

      return request;
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
    const {
      template,
      subject,
      context: {
        title,
        cta: { label },
      },
    } = MAIL_OPTIONS.ORGANIZATION_REQUEST_APPROVAL;

    await this.mailService.sendEmail({
      to: email,
      template,
      subject,
      context: {
        title,
        subtitle: MAIL_OPTIONS.ORGANIZATION_REQUEST_APPROVAL.context.subtitle(),
        cta: {
          link: MAIL_OPTIONS.ORGANIZATION_REQUEST_APPROVAL.context.cta.link(
            'www.google.com',
          ),
          label,
        },
      },
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

    const {
      template,
      subject,
      context: { title },
    } = MAIL_OPTIONS.ORGANIZATION_REQUEST_REJECTION;

    await this.mailService.sendEmail({
      to: found.email,
      template,
      subject,
      context: {
        title,
        subtitle:
          MAIL_OPTIONS.ORGANIZATION_REQUEST_REJECTION.context.subtitle(),
      },
    });

    return this.find(requestId);
  }

  public async countOrganizationRequest(
    findConditions?: FindManyOptions<OrganizationRequest>,
  ): Promise<number> {
    return this.organizationRequestRepository.count(findConditions);
  }

  public async sendRestrictRequest(organizationId: number): Promise<void> {
    try {
      const organization = await this.organizationService.findWithUsers(
        organizationId,
      );
      const superAdmins = await this.userService.findMany({
        where: { role: Role.SUPER_ADMIN },
      });

      const {
        template,
        subject,
        context: { title },
      } = MAIL_OPTIONS.ORGANIZATION_RESTRICT_SUPERADMIN;

      await this.mailService.sendEmail({
        to: superAdmins.map((superAdmin) => superAdmin.email),
        template,
        subject,
        context: {
          title,
          subtitle:
            MAIL_OPTIONS.ORGANIZATION_RESTRICT_SUPERADMIN.context.subtitle(
              organization.organizationGeneral.name,
            ),
        },
      });
    } catch (error) {
      this.logger.error({
        error: { error },
        ...MAIL_ERRORS.RESTRICT_FOR_SUPERADMINS,
      });
      throw error;
    }
  }

  public async query(query: string): Promise<any> {
    return this.organizationRequestRepository.query(query);
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
