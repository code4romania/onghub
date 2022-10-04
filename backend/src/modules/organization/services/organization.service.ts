import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';

import { Pagination } from 'src/common/interfaces/pagination';
import { MAIL_TEMPLATES } from 'src/mail/enums/mail.enum';
import { MailService } from 'src/mail/services/mail.service';
import { Role } from 'src/modules/user/enums/role.enum';
import { AnafService } from 'src/shared/services';
import { FileManagerService } from 'src/shared/services/file-manager.service';
import { NomenclaturesService } from 'src/shared/services/nomenclatures.service';
import { DataSource, In } from 'typeorm';
import { OrganizationFinancialService } from '.';
import {
  ORGANIZATION_ERRORS,
  ORGANIZATION_REQUEST_ERRORS,
} from '../constants/errors.constants';
import { ORGANIZATION_FILES_DIR } from '../constants/files.constants';
import { ORGANIZATION_FILTERS_CONFIG } from '../constants/organization-filter.config';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
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
import { OrganizationView } from '../entities/organization.view-entity';
import { Area } from '../enums/organization-area.enum';
import { OrganizationStatus } from '../enums/organization-status.enum';
import { OrganizationViewRepository } from '../repositories';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationActivityService } from './organization-activity.service';
import { OrganizationGeneralService } from './organization-general.service';
import { OrganizationLegalService } from './organization-legal.service';
import { OrganizationReportService } from './organization-report.service';

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
    private readonly anafService: AnafService,
    private readonly fileManagerService: FileManagerService,
    private readonly organizationViewRepository: OrganizationViewRepository,
    private readonly mailService: MailService,
  ) {}

  public async create(
    createOrganizationDto: CreateOrganizationDto,
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
    const financialInformation = await this.anafService.getFinancialInformation(
      createOrganizationDto.general.cui,
      lastYear,
    );

    // create the parent entry with default values
    return this.organizationRepository.save({
      organizationGeneral: {
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
  }

  public async find(id: number) {
    const organization = await this.organizationRepository.get({
      where: { id },
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

    return this.organizationViewRepository.getManyPaginated(
      ORGANIZATION_FILTERS_CONFIG,
      paginationOptions,
    );
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
        'organizationActivity.federations',
        'organizationActivity.coalitions',
        'organizationActivity.branches',
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

  /**
   * Update organization will only update one child at the time
   * TODO: Review if we put this in organization
   */
  public async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<any> {
    const organization = await this.find(id);

    if (updateOrganizationDto.general) {
      return this.organizationGeneralService.update(
        organization.organizationGeneralId,
        updateOrganizationDto.general,
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
      );
    }

    if (updateOrganizationDto.financial) {
      const organizationFinancial =
        await this.organizationFinancialService.update(
          updateOrganizationDto.financial,
        );

      await this.organizationRepository.updateOne({
        id,
        syncedOn: new Date(),
      });

      return organizationFinancial;
    }

    if (updateOrganizationDto.report) {
      const organizationReport = await this.organizationReportService.update(
        organization.organizationReportId,
        updateOrganizationDto.report,
      );

      await this.organizationRepository.updateOne({
        id,
        syncedOn: new Date(),
      });

      return organizationReport;
    }

    return null;
  }

  public async upload(
    organizationId: number,
    logo: Express.Multer.File[],
    organizationStatute: Express.Multer.File[],
  ): Promise<Organization> {
    const organization = await this.organizationRepository.get({
      where: { id: organizationId },
      relations: ['organizationGeneral', 'organizationLegal'],
    });

    if (!organization) {
      throw new NotFoundException({
        ...ORGANIZATION_ERRORS.GET,
      });
    }

    try {
      if (logo) {
        if (organization.organizationGeneral.logo) {
          await this.fileManagerService.deleteFiles([
            organization.organizationGeneral.logo,
          ]);
        }

        const uploadedFile = await this.fileManagerService.uploadFiles(
          `${organizationId}/${ORGANIZATION_FILES_DIR.LOGO}`,
          logo,
        );

        await this.organizationGeneralService.update(
          organization.organizationGeneral.id,
          {
            logo: uploadedFile[0],
          },
        );
      }

      if (organizationStatute) {
        if (organization.organizationLegal.organizationStatute) {
          await this.fileManagerService.deleteFiles([
            organization.organizationLegal.organizationStatute,
          ]);
        }

        const uploadedFile = await this.fileManagerService.uploadFiles(
          `${organizationId}/${ORGANIZATION_FILES_DIR.STATUTE}`,
          organizationStatute,
        );

        await this.organizationLegalService.update(
          organization.organizationLegal.id,
          {
            organizationStatute: uploadedFile[0],
          },
        );
      }

      return this.organizationRepository.get({
        where: { id: organizationId },
        relations: ['organizationGeneral', 'organizationLegal'],
      });
    } catch (error) {
      throw new BadRequestException({
        ...ORGANIZATION_ERRORS.UPLOAD,
        error: { error },
      });
    }
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

    await this.organizationRepository.updateOne({
      id: organizationId,
      syncedOn: new Date(),
    });

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

    await this.organizationRepository.updateOne({
      id: organizationId,
      syncedOn: new Date(),
    });

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

    const adminEmails = admins.map((item) => {
      return item.email;
    });

    await this.organizationRepository.updateOne({
      id: organizationId,
      status: OrganizationStatus.RESTRICTED,
    });

    await this.mailService.sendEmail({
      to: adminEmails,
      template: MAIL_TEMPLATES.RESTRICT_ORGANIZATION_ADMIN,
      context: {
        orgName: organization.organizationGeneral.name,
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

    const organizationWithRafNumber = this.organizationGeneralService.findOne({
      where: { rafNumber },
    });

    if (organizationWithRafNumber) {
      errors.push(
        new BadRequestException(
          ORGANIZATION_REQUEST_ERRORS.CREATE.RAF_NUMBER_EXISTS,
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
  public async createNewReportingEntries(organizationId: string) {
    const year = new Date().getFullYear() - 2;
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
      financialFromAnaf = await this.anafService.getFinancialInformation(
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
      });

      return orgUpdated;
    } catch (err) {
      throw new InternalServerErrorException({
        ...ORGANIZATION_ERRORS.CREATE_NEW_REPORTING_ENTRIES.ADD_NEW,
        error: err,
      });
    }
  }
}
