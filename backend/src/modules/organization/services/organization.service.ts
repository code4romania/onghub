import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { formatNumber } from 'libphonenumber-js';
import { Pagination } from 'src/common/interfaces/pagination';
import { MAIL_OPTIONS } from 'src/mail/constants/template.constants';
import { MailService } from 'src/mail/services/mail.service';
import { CivicCenterServiceService } from 'src/modules/civic-center-service/services/civic-center.service';
import { PracticeProgramService } from 'src/modules/practice-program/services/practice-program.service';
import { Role } from 'src/modules/user/enums/role.enum';
import { FILE_TYPE } from 'src/shared/enum/FileType.enum';
import { S3FileManagerService } from 'src/shared/services/s3-file-manager.service';
import { NomenclaturesService } from 'src/shared/services/nomenclatures.service';
import { DataSource, FindManyOptions, FindOperator, In } from 'typeorm';
import { OrganizationFinancialService } from '.';
import {
  ORGANIZATION_ERRORS,
  ORGANIZATION_REQUEST_ERRORS,
} from '../constants/errors.constants';
import { ORGANIZATION_FILES_DIR } from '../constants/files.constants';
import {
  ORGANIZATION_FILTERS_CONFIG,
  ORGANIZATION_WITH_PRACTICE_PROGRAM_FILTERS_CONFIG,
  ORGANIZATION_WITH_SERVICES_FILTERS_CONFIG,
} from '../constants/organization-filter.config';
import { CreateUserRequestDto } from '../dto/create-organization-request.dto';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { GetOrganizationWithPracticeProgramsFilterDto } from '../dto/get-organization-with-practice-programs-fillter.dto';
import { GetOrganizationWithServicesFilterDto } from '../dto/get-organization-with-services-filter.dto';
import { OrganizationFilterDto } from '../dto/organization-filter.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import {
  Contact,
  Investor,
  Organization,
  OrganizationActivity,
  OrganizationFinancial,
  OrganizationGeneral,
  OrganizationLegal,
  OrganizationReport,
  Partner,
  Report,
} from '../entities';
import { OrganizationView } from '../entities/organization-view.entity';
import { Area } from '../enums/organization-area.enum';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';
import { OrganizationStatus } from '../enums/organization-status.enum';
import { OrganizationFlat } from '../interfaces/OrganizationFlat.interface';
import { OrganizationWithPracticePrograms } from '../interfaces/OrganizationWithPracticePrograms.interface';
import { OrganizationWithServices } from '../interfaces/OrganizationWithServices.interface';
import { OrganizationViewRepository } from '../repositories';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationActivityService } from './organization-activity.service';
import { OrganizationGeneralService } from './organization-general.service';
import { OrganizationLegalService } from './organization-legal.service';
import { OrganizationReportService } from './organization-report.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import CUIChangedEvent from '../events/CUI-changed-event.class';
import { ORGANIZATION_EVENTS } from '../constants/events.constants';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);
  constructor(
    private readonly dataSource: DataSource,
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationGeneralService: OrganizationGeneralService,
    private readonly organizationActivityService: OrganizationActivityService,
    private readonly organizationLegalService: OrganizationLegalService,
    private readonly organizationFinancialService: OrganizationFinancialService,
    private readonly organizationReportService: OrganizationReportService,
    private readonly nomenclaturesService: NomenclaturesService,
    private readonly fileManagerService: S3FileManagerService,
    private readonly organizationViewRepository: OrganizationViewRepository,
    private readonly mailService: MailService,
    private readonly practiceProgramService: PracticeProgramService,
    private readonly civicCenterService: CivicCenterServiceService,
  ) {}

  public async create(
    createUserRequestDto: CreateUserRequestDto,
    createOrganizationDto: CreateOrganizationDto,
    logo: Express.Multer.File[],
    organizationStatute: Express.Multer.File[],
  ): Promise<Organization> {
    if (
      createOrganizationDto.activity.area === Area.LOCAL &&
      !createOrganizationDto.activity.cities
    ) {
      throw new BadRequestException({
        ...ORGANIZATION_ERRORS.CREATE_ACTIVITY.LOCAL,
      });
    }

    if (
      createOrganizationDto.activity.area === Area.REGIONAL &&
      !createOrganizationDto.activity.regions
    ) {
      throw new BadRequestException({
        ...ORGANIZATION_ERRORS.CREATE_ACTIVITY.REGION,
      });
    }

    if (createOrganizationDto.legal.directors?.length < 3) {
      throw new BadRequestException({
        ...ORGANIZATION_ERRORS.CREATE_LEGAL.DIRECTORS_MIN,
      });
    }

    let cities = [];
    if (createOrganizationDto.activity.area === Area.LOCAL) {
      cities = await this.nomenclaturesService.getCities({
        where: { id: In(createOrganizationDto.activity.cities) },
      });
    }

    let regions = [];
    if (createOrganizationDto.activity.area === Area.REGIONAL) {
      regions = await this.nomenclaturesService.getRegions({
        where: { id: In(createOrganizationDto.activity.regions) },
      });
    }

    let federations = [];
    if (createOrganizationDto.activity.isPartOfFederation) {
      if (!createOrganizationDto.activity.federations) {
        throw new BadRequestException({
          ...ORGANIZATION_ERRORS.CREATE_ACTIVITY.FEDERATION,
        });
      }

      federations = await this.nomenclaturesService.getFederations({
        where: { id: In(createOrganizationDto.activity.federations) },
      });
    }

    let coalitions = [];
    if (createOrganizationDto.activity.isPartOfCoalition) {
      if (!createOrganizationDto.activity.coalitions) {
        throw new BadRequestException({
          ...ORGANIZATION_ERRORS.CREATE_ACTIVITY.COALITION,
        });
      }

      coalitions = await this.nomenclaturesService.getCoalitions({
        where: { id: In(createOrganizationDto.activity.coalitions) },
      });
    }

    let branches = [];
    if (createOrganizationDto.activity.hasBranches) {
      if (createOrganizationDto.activity.branches?.length === 0) {
        throw new BadRequestException({
          ...ORGANIZATION_ERRORS.CREATE_ACTIVITY.BRANCH,
        });
      }

      branches = await this.nomenclaturesService.getCities({
        where: { id: In(createOrganizationDto.activity.branches) },
      });
    }

    const domains = await this.nomenclaturesService.getDomains({
      where: { id: In(createOrganizationDto.activity.domains) },
    });

    const lastYear = new Date().getFullYear() - 1;

    // get anaf data
    const financialInformation =
      await this.organizationFinancialService.getFinancialInformation(
        createOrganizationDto.general.cui,
        lastYear,
      );

    // create the parent entry with default values
    const organization = await this.organizationRepository.save({
      syncedOn: new Date(),
      organizationGeneral: {
        contact: {
          fullName: createUserRequestDto.name,
          ...createUserRequestDto,
        },
        ...createOrganizationDto.general,
      },
      organizationActivity: {
        ...createOrganizationDto.activity,
        domains,
        regions,
        cities,
        federations,
        coalitions,
        branches,
      },
      organizationLegal: {
        ...createOrganizationDto.legal,
      },
      organizationFinancial:
        this.organizationFinancialService.generateFinancialReportsData(
          lastYear,
          financialInformation,
        ),
      organizationReport: {
        reports: [{ year: lastYear }],
        partners: [{ year: lastYear }],
        investors: [{ year: lastYear }],
      },
    });

    // upload logo
    try {
      if (logo) {
        const uploadedFile = await this.fileManagerService.uploadFiles(
          `${organization.id}/${ORGANIZATION_FILES_DIR.LOGO}`,
          logo,
          FILE_TYPE.IMAGE,
        );

        await this.organizationGeneralService.update(organization, {
          logo: uploadedFile[0],
        });
      }

      // upload organization statute
      if (organizationStatute) {
        const uploadedFile = await this.fileManagerService.uploadFiles(
          `${organization.id}/${ORGANIZATION_FILES_DIR.STATUTE}`,
          organizationStatute,
          FILE_TYPE.FILE,
        );

        await this.organizationLegalService.update(
          organization.organizationLegal.id,
          {
            organizationStatute: uploadedFile[0],
          },
        );
      }
    } catch (error) {
      this.logger.error({
        error: { error },
        ...ORGANIZATION_ERRORS.UPLOAD,
      });
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          ...ORGANIZATION_ERRORS.UPLOAD,
          error,
        });
      }
    }

    return organization;
  }

  public async find(id: number, options?: { relations?: string[] }) {
    const organization = await this.organizationRepository.get({
      where: { id },
      ...(options?.relations?.length
        ? { relations: [...options.relations] }
        : {}),
    });

    if (!organization) {
      throw new NotFoundException({
        ...ORGANIZATION_ERRORS.GET,
      });
    }

    return organization;
  }

  public async findAll({
    options,
  }: {
    options: OrganizationFilterDto;
  }): Promise<Pagination<OrganizationView>> {
    const paginationOptions: any = {
      ...options,
    };

    const ongList = await this.organizationViewRepository.getManyPaginated(
      ORGANIZATION_FILTERS_CONFIG,
      paginationOptions,
    );

    // Map the logo url
    const items =
      await this.fileManagerService.mapLogoToEntity<OrganizationView>(
        ongList.items,
      );

    return {
      ...ongList,
      items,
    };
  }

  public async getLogo(id: number): Promise<string> {
    const organization = await this.organizationRepository.get({
      where: { id },
      relations: ['organizationGeneral'],
    });

    if (!organization) {
      throw new NotFoundException({
        ...ORGANIZATION_ERRORS.GET,
      });
    }

    // check for logo and add public url
    if (organization.organizationGeneral.logo) {
      const logo = await this.fileManagerService.generatePresignedURL(
        organization.organizationGeneral.logo,
      );
      organization.organizationGeneral.logo = logo;
    }

    return organization.organizationGeneral.logo;
  }

  public async findWithRelations(id: number): Promise<Organization> {
    const organization = await this.organizationRepository.get({
      where: { id },
      relations: [
        'organizationGeneral',
        'organizationGeneral.city',
        'organizationGeneral.county',
        'organizationGeneral.contact',
        'organizationActivity',
        'organizationActivity.federations',
        'organizationActivity.coalitions',
        'organizationActivity.domains',
        'organizationActivity.cities',
        'organizationActivity.cities.county',
        'organizationActivity.federations',
        'organizationActivity.coalitions',
        'organizationActivity.branches',
        'organizationActivity.branches.county',
        'organizationActivity.regions',
        'organizationLegal',
        'organizationLegal.legalReprezentative',
        'organizationLegal.directors',
        'organizationFinancial',
        'organizationReport',
        'organizationReport.reports',
        'organizationReport.partners',
        'organizationReport.investors',
      ],
    });

    if (!organization) {
      throw new NotFoundException({
        ...ORGANIZATION_ERRORS.GET,
      });
    }

    // check for logo and add public url
    if (organization.organizationGeneral.logo) {
      const logo = await this.fileManagerService.generatePresignedURL(
        organization.organizationGeneral.logo,
      );
      organization.organizationGeneral.logo = logo;
    }

    // check for organization statute and add public url
    if (organization.organizationLegal.organizationStatute) {
      const organizationStatute =
        await this.fileManagerService.generatePresignedURL(
          organization.organizationLegal.organizationStatute,
        );
      organization.organizationLegal.organizationStatute = organizationStatute;
    }

    return organization;
  }

  public async findWithUsers(id: number): Promise<Organization> {
    const organization = await this.organizationRepository.get({
      where: { id },
      relations: ['users', 'organizationGeneral'],
    });

    if (!organization) {
      throw new NotFoundException({
        ...ORGANIZATION_ERRORS.GET,
      });
    }

    return organization;
  }

  public async findOneOrganizationWithActivePracticePrograms(
    organizationId: number,
  ): Promise<OrganizationWithPracticePrograms> {
    try {
      // 1. get organization info
      const organization = await this.organizationRepository.get({
        select: {
          id: true,
          organizationGeneral: {
            name: true,
            logo: true,
            description: true,
            shortDescription: true,
            facebook: true,
            twitter: true,
            instagram: true,
            contact: {
              fullName: true,
              email: true,
              phone: true,
            },
            city: {
              name: true,
              county: {
                name: true,
              },
            },
          },
          organizationActivity: {
            id: true,
            domains: {
              name: true,
            },
          },
        },
        relations: [
          'organizationGeneral',
          'organizationGeneral.city',
          'organizationGeneral.contact',
          'organizationGeneral.city.county',
          'organizationActivity',
          'organizationActivity.domains',
        ],
        where: {
          id: organizationId,
          status: OrganizationStatus.ACTIVE,
        },
      });

      // 1.1 throw error fi organization not found
      if (!organization) {
        throw new NotFoundException({
          ...ORGANIZATION_ERRORS.GET,
        });
      }

      // 2. get practice programs by organization id
      const practicePrograms =
        await this.practiceProgramService.findPracticeShortPracticeProgramsByOrganization(
          organizationId,
        );

      // 3. get public url logo
      if (organization.organizationGeneral.logo) {
        organization.organizationGeneral.logo =
          await this.fileManagerService.generatePresignedURL(
            organization.organizationGeneral.logo,
          );
      }

      // 4. flatten organization
      const flatOrganization =
        this.flattenOrganizationWithPullingApps(organization);

      return { ...flatOrganization, practicePrograms };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          error: JSON.stringify(error),
          ...ORGANIZATION_ERRORS.GET_ORGANIZATION_WITH_ACTIVE_PRACTICE_PROGRAMS,
        });
      }
    }
  }

  public async findOneOrganizationWithActiveServices(
    organizationId: number,
  ): Promise<OrganizationWithServices> {
    try {
      // 1. get organization info
      const organization = await this.organizationRepository.get({
        select: {
          id: true,
          organizationGeneral: {
            name: true,
            logo: true,
            description: true,
            shortDescription: true,
            facebook: true,
            twitter: true,
            instagram: true,
            contact: {
              fullName: true,
              email: true,
              phone: true,
            },
            city: {
              name: true,
              county: {
                name: true,
              },
            },
          },
          organizationActivity: {
            id: true,
            domains: {
              name: true,
            },
          },
        },
        relations: [
          'organizationGeneral',
          'organizationGeneral.city',
          'organizationGeneral.contact',
          'organizationGeneral.city.county',
          'organizationActivity',
          'organizationActivity.domains',
        ],
        where: {
          id: organizationId,
          status: OrganizationStatus.ACTIVE,
        },
      });

      // 1.1 throw error fi organization not found
      if (!organization) {
        throw new NotFoundException({
          ...ORGANIZATION_ERRORS.GET,
        });
      }

      // 2. get services by organization id
      const services =
        await this.civicCenterService.findPracticeShortServicesByOrganization(
          organizationId,
        );

      // 3. get public url logo
      if (organization.organizationGeneral.logo) {
        organization.organizationGeneral.logo =
          await this.fileManagerService.generatePresignedURL(
            organization.organizationGeneral.logo,
          );
      }

      // 4. flatten organization
      const flatOrganization =
        this.flattenOrganizationWithPullingApps(organization);

      return { ...flatOrganization, services };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          error: JSON.stringify(error),
          ...ORGANIZATION_ERRORS.GET_ORGANIZATION_WITH_ACTIVE_SERVICES,
        });
      }
    }
  }

  public async findAllOrganizationsWithActivePracticePrograms(
    options: GetOrganizationWithPracticeProgramsFilterDto,
  ): Promise<Pagination<any>> {
    try {
      const { domains, cityId, ...filters } = options;

      // 1. get only organization with active practice programs
      let paginationOptions: GetOrganizationWithPracticeProgramsFilterDto & {
        practicePrograms: {
          active: boolean;
        };
        organizationGeneral?: {
          city: {
            id: number;
          };
        };
        organizationActivity?: {
          domains: {
            id: FindOperator<number>;
          };
        };
        status: OrganizationStatus;
      } = {
        ...filters,
        status: OrganizationStatus.ACTIVE,
        practicePrograms: {
          active: true, // get only organizations with active practice programs
        },
      };

      // 2. add filter by domain if provided
      if (domains?.length > 0) {
        paginationOptions = {
          ...paginationOptions,
          organizationActivity: {
            domains: {
              id: In(domains),
            },
          },
        };
      }

      // 3. add filter by city if provided
      if (cityId) {
        paginationOptions = {
          ...paginationOptions,
          organizationGeneral: {
            city: {
              id: cityId,
            },
          },
        };
      }

      // 4. get paginated organizations
      const organizations = await this.organizationRepository.getManyPaginated(
        ORGANIZATION_WITH_PRACTICE_PROGRAM_FILTERS_CONFIG,
        paginationOptions,
      );

      // 5. flatten the request
      const flatOrganizations = this.flattenOrganization(organizations);

      // 6. map the logo to organization
      const items =
        await this.fileManagerService.mapLogoToEntity<OrganizationFlat>(
          flatOrganizations.items,
        );

      return {
        ...flatOrganizations,
        items,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          error: JSON.stringify(error),
          ...ORGANIZATION_ERRORS.GET_ORGANIZATIONS_WITH_ACTIVE_PRACTICE_PROGRAMS,
        });
      }
    }
  }

  public async findAllOrganizationsWithActiveServices(
    options: GetOrganizationWithServicesFilterDto,
  ): Promise<Pagination<OrganizationFlat>> {
    try {
      const { domains, cityId, ...filters } = options;

      // 1. get only organization with active services
      let paginationOptions: GetOrganizationWithServicesFilterDto & {
        civicCenterServices: {
          active: boolean;
        };
        organizationGeneral?: {
          city: {
            id: number;
          };
        };
        organizationActivity?: {
          domains: {
            id: FindOperator<number>;
          };
        };
        status: OrganizationStatus;
      } = {
        ...filters,
        status: OrganizationStatus.ACTIVE,
        civicCenterServices: {
          active: true, // get only organizations with active services
        },
      };

      // 2. add filter by domain if provided
      if (domains?.length > 0) {
        paginationOptions = {
          ...paginationOptions,
          organizationActivity: {
            domains: {
              id: In(domains),
            },
          },
        };
      }

      // 3. add filter by city if provided
      if (cityId) {
        paginationOptions = {
          ...paginationOptions,
          organizationGeneral: {
            city: {
              id: cityId,
            },
          },
        };
      }

      // 4. get paginated organizations
      const organizations = await this.organizationRepository.getManyPaginated(
        ORGANIZATION_WITH_SERVICES_FILTERS_CONFIG,
        paginationOptions,
      );

      // 5. flatten the request
      const flatOrganizations = this.flattenOrganization(organizations);

      // 6. map the logo to organization
      const items =
        await this.fileManagerService.mapLogoToEntity<OrganizationFlat>(
          flatOrganizations.items,
        );

      return {
        ...flatOrganizations,
        items,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          error: JSON.stringify(error),
          ...ORGANIZATION_ERRORS.GET_ORGANIZATIONS_WITH_ACTIVE_SERVICES,
        });
      }
    }
  }

  /**
   * Update organization will only update one child at the time
   */
  public async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
    logo?: Express.Multer.File[],
    organizationStatute?: Express.Multer.File[],
  ): Promise<any> {
    const organization = await this.find(id);

    if (updateOrganizationDto.general) {
      return this.organizationGeneralService.update(
        organization,
        updateOrganizationDto.general,
        `${id}/${ORGANIZATION_FILES_DIR.LOGO}`,
        logo,
      );
    }

    if (updateOrganizationDto.activity) {
      return this.organizationActivityService.update(
        organization.organizationActivityId,
        updateOrganizationDto.activity,
      );
    }

    if (updateOrganizationDto.legal) {
      return this.organizationLegalService.update(
        organization.organizationLegalId,
        updateOrganizationDto.legal,
        `${id}/${ORGANIZATION_FILES_DIR.STATUTE}`,
        organizationStatute,
      );
    }

    if (updateOrganizationDto.financial) {
      const organizationFinancial =
        await this.organizationFinancialService.update(
          updateOrganizationDto.financial,
        );

      await this.updateOrganizationCompletionStatus(organization.id);

      return organizationFinancial;
    }

    if (updateOrganizationDto.report) {
      const organizationReport = await this.organizationReportService.update(
        organization.organizationReportId,
        updateOrganizationDto.report,
      );

      await this.updateOrganizationCompletionStatus(organization.id);

      return organizationReport;
    }

    return null;
  }

  public async uploadPartners(
    organizationId: number,
    partnerId: number,
    numberOfPartners: number,
    files: Express.Multer.File[],
  ): Promise<OrganizationReport> {
    const organization = await this.organizationRepository.get({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException({
        ...ORGANIZATION_ERRORS.GET,
      });
    }

    await this.organizationReportService.updatePartner(
      partnerId,
      numberOfPartners,
      organizationId,
      files,
    );

    await this.updateOrganizationCompletionStatus(organization.id);

    return this.organizationReportService.findOne(
      organization.organizationReportId,
    );
  }

  public async uploadInvestors(
    organizationId: number,
    investorId: number,
    numberOfInvestors: number,
    files: Express.Multer.File[],
  ): Promise<OrganizationReport> {
    const organization = await this.organizationRepository.get({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException({
        ...ORGANIZATION_ERRORS.GET,
      });
    }

    await this.organizationReportService.updateInvestor(
      investorId,
      numberOfInvestors,
      organizationId,
      files,
    );

    await this.updateOrganizationCompletionStatus(organization.id);

    return this.organizationReportService.findOne(
      organization.organizationReportId,
    );
  }

  public async deletePartner(
    organizationId: number,
    partnerId: number,
  ): Promise<OrganizationReport> {
    const organization = await this.organizationRepository.get({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException({
        ...ORGANIZATION_ERRORS.GET,
      });
    }

    await this.organizationReportService.deletePartner(partnerId);

    await this.updateOrganizationCompletionStatus(organization.id);

    return this.organizationReportService.findOne(
      organization.organizationReportId,
    );
  }

  public async deleteInvestor(
    organizationId: number,
    investorId: number,
  ): Promise<OrganizationReport> {
    const organization = await this.organizationRepository.get({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException({
        ...ORGANIZATION_ERRORS.GET,
      });
    }

    await this.organizationReportService.deleteInvestor(investorId);

    await this.updateOrganizationCompletionStatus(organization.id);

    return this.organizationReportService.findOne(
      organization.organizationReportId,
    );
  }

  /**
   * Will update the status from PENDING to ACTIVE
   *
   * @throws Will throw error if the organization is already in ACTIVE state
   * @param organizationId the ORG to be activated
   */
  public async activate(organizationId: number) {
    const org = await this.find(organizationId);

    if (org.status === OrganizationStatus.ACTIVE) {
      throw new BadRequestException(ORGANIZATION_ERRORS.ACTIVATE);
    }

    return this.organizationRepository.updateOne({
      id: organizationId,
      status: OrganizationStatus.ACTIVE,
    });
  }

  public async restrict(organizationId: number) {
    const organization = await this.findWithUsers(organizationId);

    if (organization.status === OrganizationStatus.RESTRICTED) {
      throw new BadRequestException(ORGANIZATION_ERRORS.ALREADY_RESTRICTED);
    }

    const admins = organization.users.filter(
      (item) => item.role === Role.ADMIN,
    );

    await this.organizationRepository.updateOne({
      id: organizationId,
      status: OrganizationStatus.RESTRICTED,
    });

    const {
      template,
      subject,
      context: { title },
    } = MAIL_OPTIONS.ORGANIZATION_RESTRICT_ADMIN;

    await this.mailService.sendEmail({
      to: admins.map((admin) => admin.email),
      template,
      subject,
      context: {
        title,
        subtitle: MAIL_OPTIONS.ORGANIZATION_RESTRICT_ADMIN.context.subtitle(
          organization.organizationGeneral.name,
        ),
      },
    });

    return organization;
  }

  public async delete(organizationId: number): Promise<void> {
    const organization = await this.findWithRelations(organizationId);

    if (organization.status !== OrganizationStatus.PENDING) {
      throw new BadRequestException({
        ...ORGANIZATION_ERRORS.DELETE.NOT_PENDING,
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      // 1. delete organization
      await queryRunner.manager.delete(Organization, organizationId);

      // 2. delete report
      const reportIds = organization.organizationReport.reports.map(
        (report) => report.id,
      );
      await queryRunner.manager.delete(Report, reportIds);

      const inverstorIds = organization.organizationReport.investors.map(
        (investor) => investor.id,
      );
      await queryRunner.manager.delete(Investor, inverstorIds);

      const partnerIds = organization.organizationReport.partners.map(
        (partner) => partner.id,
      );
      await queryRunner.manager.delete(Partner, partnerIds);

      await queryRunner.manager.delete(
        OrganizationReport,
        organization.organizationReportId,
      );

      // 3. delete financial
      const organizationFinancialIds = organization.organizationFinancial.map(
        (financial) => financial.id,
      );
      await queryRunner.manager.delete(
        OrganizationFinancial,
        organizationFinancialIds,
      );

      // 4. delete delete legal
      await queryRunner.manager.delete(
        Contact,
        organization.organizationLegal.legalReprezentativeId,
      );

      const directorsIds = organization.organizationLegal.directors.map(
        (director) => director.id,
      );
      await queryRunner.manager.delete(Contact, directorsIds);

      await queryRunner.manager.delete(
        OrganizationLegal,
        organization.organizationLegalId,
      );

      // 5. delete activity
      await queryRunner.manager.delete(
        OrganizationActivity,
        organization.organizationActivityId,
      );

      // 6. delete general
      await queryRunner.manager.delete(
        OrganizationGeneral,
        organization.organizationGeneralId,
      );

      await queryRunner.manager.delete(
        Contact,
        organization.organizationGeneral.contactId,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();

      this.logger.error({
        error: { error },
        ...ORGANIZATION_ERRORS.DELETE.ONG,
      });
      const err = error?.response;
      throw new BadRequestException({
        ...ORGANIZATION_ERRORS.DELETE.ONG,
        error: err,
      });
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  public async validateOrganizationGeneral(
    cui: string,
    rafNumber: string,
    name: string,
    email: string,
    phone: string,
    alias: string,
  ): Promise<any[]> {
    const errors = [];
    const organizationWithName = await this.organizationGeneralService.findOne({
      where: { name },
    });

    if (organizationWithName) {
      errors.push(
        new BadRequestException(
          ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_NAME_EXISTS,
        ),
      );
    }

    const organizationWithCUI = await this.organizationGeneralService.findOne({
      where: { cui },
    });

    if (organizationWithCUI) {
      errors.push(
        new BadRequestException(ORGANIZATION_REQUEST_ERRORS.CREATE.CUI_EXISTS),
      );
    }

    const organizationWithRafNumber =
      await this.organizationGeneralService.findOne({
        where: { rafNumber },
      });

    if (organizationWithRafNumber) {
      errors.push(
        new BadRequestException(
          ORGANIZATION_REQUEST_ERRORS.CREATE.RAF_NUMBER_EXISTS,
        ),
      );
    }

    const organizationWithEmail = await this.organizationGeneralService.findOne(
      {
        where: { email },
      },
    );

    if (organizationWithEmail) {
      errors.push(
        new BadRequestException(
          ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_EMAIL_EXISTS,
        ),
      );
    }

    const organizationWithAlias = await this.organizationGeneralService.findOne(
      {
        where: { alias },
      },
    );

    if (organizationWithAlias) {
      errors.push(
        new BadRequestException(
          ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_ALIAS_EXISTS,
        ),
      );
    }

    const formattedPhone = formatNumber(
      phone.trim().split(' ').join(''),
      'RO',
      'E.164',
    );

    const organizationWithPhone = await this.organizationGeneralService.findOne(
      {
        where: { phone: formattedPhone },
      },
    );

    if (organizationWithPhone) {
      errors.push(
        new BadRequestException(
          ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_PHONE_EXISTS,
        ),
      );
    }

    return errors;
  }

  /**
   * Once every year, 1st of June we request new data to be completed by the NGOs for the past year
   *
   * Preconditions:
   *
   *  - The NGO does not have the Financial data, Reports, Parteners, Investors entries already added for the year we request it
   *
   *  1. We query ANAF and create 2 new entries to be completed in the Financial section (Expenses, Income)
   *  2. Create 3 new entires for Reports, Parteners, Investors (Open Data)
   *  3. Send notification email to the NGO Admin to take action
   */
  public async createNewReportingEntries(
    organizationId: string,
    forYear?: number,
  ) {
    const year = forYear ?? new Date().getFullYear() - 1;
    // 1. Check if the NGO already has the data we try to add
    const organization = await this.findWithRelations(+organizationId);

    const { reports, partners, investors } = organization.organizationReport;

    const hasDataFromYear = (
      data: OrganizationFinancial[] | Report[] | Partner[] | Investor[],
    ) => data.some((entry) => entry.year === year);

    if (
      hasDataFromYear(organization.organizationFinancial) ||
      hasDataFromYear(reports) ||
      hasDataFromYear(partners) ||
      hasDataFromYear(investors)
    ) {
      throw new BadRequestException(
        ORGANIZATION_ERRORS.CREATE_NEW_REPORTING_ENTRIES.ALREADY_EXIST,
      );
    }

    // 2. Get data from ANAF
    let financialFromAnaf = null;
    try {
      financialFromAnaf =
        await this.organizationFinancialService.getFinancialInformation(
          organization.organizationGeneral.cui,
          year,
        );
    } catch (err) {
      throw new InternalServerErrorException({
        ...ORGANIZATION_ERRORS.CREATE_NEW_REPORTING_ENTRIES.ANAF_ERRORED,
        error: err,
      });
    }

    // 2.1. Generate the financial reports
    const newFinancialReport =
      this.organizationFinancialService.generateFinancialReportsData(
        year,
        financialFromAnaf,
      );

    // 3. Update the ORG in DB including financial data and reports (reports, partners, investors) cascaded
    try {
      const orgUpdated = await this.organizationRepository.save({
        ...organization,
        organizationFinancial: [
          ...organization.organizationFinancial,
          ...newFinancialReport,
        ],
        organizationReport: {
          ...organization.organizationReport,
          reports: [...organization.organizationReport.reports, { year }],
          partners: [...organization.organizationReport.partners, { year }],
          investors: [...organization.organizationReport.investors, { year }],
        },
        syncedOn: new Date(),
        completionStatus: CompletionStatus.NOT_COMPLETED,
      });

      return orgUpdated;
    } catch (err) {
      throw new InternalServerErrorException({
        ...ORGANIZATION_ERRORS.CREATE_NEW_REPORTING_ENTRIES.ADD_NEW,
        error: err,
      });
    }
  }

  public async countOrganizations(
    findConditions?: FindManyOptions<Organization>,
  ): Promise<number> {
    return this.organizationRepository.count(findConditions);
  }

  /**
   * Check if the organization has all the financial, report, partner and investor data corectly completed and update the completionStatus
   */
  private async updateOrganizationCompletionStatus(
    organizationId: number,
  ): Promise<void> {
    try {
      // 1. get organization with financial, report, partener and investor data
      const organization = await this.organizationRepository.get({
        where: { id: organizationId },
        relations: [
          'organizationFinancial',
          'organizationReport',
          'organizationReport.reports',
          'organizationReport.partners',
          'organizationReport.investors',
        ],
      });

      // 2. check if we have all financial data completed
      const organizationFinancialCompleted =
        organization.organizationFinancial.findIndex(
          (financial) => financial.status === CompletionStatus.NOT_COMPLETED,
        ) < 0;

      // 3. check if report data is completed
      const organizationReportsCompleted =
        organization.organizationReport.reports.findIndex(
          (report) => report.status === CompletionStatus.NOT_COMPLETED,
        ) < 0;

      // 4. check if investor data is completed
      const organizationInvestorsCompleted =
        organization.organizationReport.investors.findIndex(
          (investor) => investor.status === CompletionStatus.NOT_COMPLETED,
        ) < 0;

      // 5. check if partner data si completed
      const organizationPartnersCompleted =
        organization.organizationReport.partners.findIndex(
          (partner) => partner.status === CompletionStatus.NOT_COMPLETED,
        ) < 0;

      // 6. If all the statuses above are true than the organization is up to date
      const organizationInSync =
        organizationFinancialCompleted &&
        organizationReportsCompleted &&
        organizationInvestorsCompleted &&
        organizationPartnersCompleted;

      // 7. Update the organization with latest status
      await this.organizationRepository.update(
        { id: organizationId },
        {
          completionStatus: organizationInSync
            ? CompletionStatus.COMPLETED
            : CompletionStatus.NOT_COMPLETED,
          syncedOn: new Date(),
        },
      );
    } catch (error) {
      // TO: validate if we throw error
      this.logger.error({
        ...ORGANIZATION_ERRORS.COMPLETION_STATUS,
        error,
        organizationId,
      });
    }
  }

  private flattenOrganization(
    organizations: Pagination<Organization>,
  ): Pagination<OrganizationFlat> {
    const { items, meta } = organizations;

    const flatItems = items.reduce((previous, current) => {
      previous.push({
        ...current.organizationGeneral,
        id: current.id,
      });
      return previous;
    }, []);

    return {
      items: flatItems,
      meta,
    };
  }

  private flattenOrganizationWithPullingApps(
    organization: Organization,
  ): OrganizationWithPracticePrograms {
    const {
      id,
      organizationGeneral: {
        city: {
          name: city,
          county: { name: county },
        },
        ...organizationGeneralData
      },
      organizationActivity,
    } = organization;

    return {
      id,
      ...organizationGeneralData,
      county,
      city,
      ...organizationActivity,
    };
  }
}
