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
import { S3FileManagerService } from 'src/shared/services/s3-file-manager.service';
import { CreateOrganizationRequestDto } from '../dto/create-organization-request.dto';
import { OrganizationRequest } from '../entities/organization-request.entity';
import { RequestStatus } from '../enums/request-status.enum';
import { OrganizationRequestRepository } from '../repositories/organization-request.repository';
import { ORGANIZATION_REQUEST_FILTER_CONFIG } from '../constants/organization-filter.config';
import { ORGANIZATION_REQUEST_ERRORS } from '../constants/errors.constants';
import { FindManyOptions } from 'typeorm';
import { MAIL_ERRORS } from 'src/mail/constants/errors.constants';
import { FILE_TYPE } from 'src/shared/enum/FileType.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from 'src/modules/notifications/constants/events.contants';
import CreateOngRequestEvent from 'src/modules/notifications/events/create-ong-request-event.class';
import ApproveOngRequestEvent from 'src/modules/notifications/events/approve-ong-request-event.class';
import RejectOngRequestEvent from 'src/modules/notifications/events/reject-ong-request-event.class';
import DisableOngRequestEvent from 'src/modules/notifications/events/disable-ong-request-event.class';
import { ValidateCreateOrganizationRequestDto } from '../dto/validate-create-organization-request.dto';
import * as Sentry from '@sentry/node';

@Injectable()
export class OrganizationRequestService {
  private readonly logger = new Logger(OrganizationRequestService.name);

  constructor(
    private readonly organizationRequestRepository: OrganizationRequestRepository,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly fileManagerService: S3FileManagerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async findAll(options: BaseFilterDto) {
    const paginationOptions = {
      ...options,
      status: RequestStatus.PENDING,
    };

    const requests = await this.organizationRequestRepository.getManyPaginated(
      ORGANIZATION_REQUEST_FILTER_CONFIG,
      paginationOptions,
    );

    for (let i = 0; i < requests.items.length; i++) {
      requests.items[i]['logo'] = await this.organizationService.getLogo(
        requests.items[i].organizationId,
      );
      delete requests.items[i].organizationId;
    }

    return requests;
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
        'organization.organizationGeneral.organizationCity',
        'organization.organizationGeneral.organizationCounty',
        'organization.organizationActivity',
        'organization.organizationActivity.federations',
        'organization.organizationActivity.coalitions',
        'organization.organizationActivity.domains',
        'organization.organizationActivity.cities',
        'organization.organizationActivity.cities.county',
        'organization.organizationActivity.federations',
        'organization.organizationActivity.coalitions',
        'organization.organizationActivity.branches',
        'organization.organizationActivity.branches.county',
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
    createRequestDto: ValidateCreateOrganizationRequestDto,
  ): Promise<any[]> {
    const { admin, organization } = createRequestDto;
    const errors = [];

    // 1. validate admin
    if (admin) {
      // check if there is an user with this data
      const user = await this.userService.findOne({
        where: [
          { email: admin.email },
          {
            phone: admin.phone,
          },
        ],
      });

      if (user) {
        errors.push(
          new BadRequestException(
            ORGANIZATION_REQUEST_ERRORS.CREATE.USER_EXISTS,
          ),
        );
      }

      // check if there is a pending request with this admin data
      const request = await this.organizationRequestRepository.get({
        where: [
          { email: admin.email, status: RequestStatus.PENDING },
          {
            phone: admin.phone,
            status: RequestStatus.PENDING,
          },
        ],
      });

      if (request) {
        errors.push(
          new BadRequestException(
            ORGANIZATION_REQUEST_ERRORS.CREATE.REQ_EXISTS,
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
    try {
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
          {
            phone: createReqDto.admin.phone,
            status: RequestStatus.PENDING,
          },
        ],
      });

      // 4. Throw error for duplicate request
      if (foundRequest) {
        throw new BadRequestException({
          ...ORGANIZATION_REQUEST_ERRORS.CREATE.REQ_EXISTS,
        });
      }

      // 5. Validate files
      this.fileManagerService.validateFiles(logo, FILE_TYPE.IMAGE);
      this.fileManagerService.validateFiles(
        organizationStatute,
        FILE_TYPE.FILE,
      );

      // 6. create organization
      const organization = await this.organizationService.create(
        createReqDto.admin,
        createReqDto.organization,
        logo,
        organizationStatute,
      );

      try {
        // 7. create request
        const request = await this.organizationRequestRepository.save({
          name: createReqDto.admin.name,
          email: createReqDto.admin.email,
          phone: createReqDto.admin.phone,
          organizationName: createReqDto.organization.general.name,
          organizationId: organization.id,
        });

        // 8. trigger emails for admin and super-admin
        this.eventEmitter.emit(
          EVENTS.CREATE_ORGANIZATION_REQUEST,
          new CreateOngRequestEvent(createReqDto.admin.email, request.id),
        );

        return request;
      } catch (error) {
        this.logger.error({ error, payload: createReqDto });
        throw error;
      }
    } catch (err) {
      Sentry.captureException(err, {
        extra: { ...createReqDto },
      });
      throw err;
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

    // 3. Create the ADMIN user
    await this.userService.createAdmin({ email, phone, name, organizationId });
    // 2. Update organization status from PENDING to ACTIVE
    await this.organizationService.activate(organizationId);
    // 4. Update the request status
    await this.update(requestId, RequestStatus.APPROVED);
    // 5. Send email with approval
    this.eventEmitter.emit(
      EVENTS.APPROVE_ORGANIZATION_REQUEST,
      new ApproveOngRequestEvent(email),
    );

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
    this.eventEmitter.emit(
      EVENTS.REJECT_ORGANIZATION_REQUEST,
      new RejectOngRequestEvent(found.email),
    );

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

      this.eventEmitter.emit(
        EVENTS.DISABLE_ORGANIZATION_REQUEST,
        new DisableOngRequestEvent(organization.organizationGeneral.name),
      );
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
