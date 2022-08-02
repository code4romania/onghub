import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AnafService } from 'src/shared/services';
import { FileManagerService } from 'src/shared/services/file-manager.service';
import { NomenclaturesService } from 'src/shared/services/nomenclatures.service';
import { In } from 'typeorm';
import { OrganizationFinancialService } from '.';
import {
  ERROR_CODES,
  HTTP_ERRORS_MESSAGES,
} from '../constants/errors.constants';
import { ORGANIZATION_FILES_DIR } from '../constants/files.constants';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { Organization, OrganizationReport } from '../entities';
import { Area } from '../enums/organization-area.enum';
import { FinancialType } from '../enums/organization-financial-type.enum';
import { OrganizationFiles } from '../models/organization-files.interface';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationActivityService } from './organization-activity.service';
import { OrganizationGeneralService } from './organization-general.service';
import { OrganizationLegalService } from './organization-legal.service';
import { OrganizationReportService } from './organization-report.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationGeneralService: OrganizationGeneralService,
    private readonly organizationActivityService: OrganizationActivityService,
    private readonly organizationLegalService: OrganizationLegalService,
    private readonly organizationFinancialService: OrganizationFinancialService,
    private readonly organizationReportService: OrganizationReportService,
    private readonly nomenclaturesService: NomenclaturesService,
    private readonly anafService: AnafService,
    private readonly fileManagerService: FileManagerService,
  ) {}

  public async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    if (
      createOrganizationDto.activity.area === Area.LOCAL &&
      !createOrganizationDto.activity.cities
    ) {
      throw new BadRequestException({
        message: HTTP_ERRORS_MESSAGES.LOCAL,
        errorCode: ERROR_CODES.ORG004,
      });
    }

    if (
      createOrganizationDto.activity.area === Area.REGIONAL &&
      !createOrganizationDto.activity.regions
    ) {
      throw new BadRequestException({
        message: HTTP_ERRORS_MESSAGES.REGION,
        errorCode: ERROR_CODES.ORG003,
      });
    }

    if (createOrganizationDto.legal.directors.length < 3) {
      throw new BadRequestException({
        message: HTTP_ERRORS_MESSAGES.MINIMUM_DIRECTORS,
        errorCode: ERROR_CODES.ORG009,
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
          message: HTTP_ERRORS_MESSAGES.MISSING_FEDERATIONS,
          errorCode: ERROR_CODES.ORG005,
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
          message: HTTP_ERRORS_MESSAGES.MISSING_COALITIONS,
          errorCode: ERROR_CODES.ORG006,
        });
      }

      coalitions = await this.nomenclaturesService.getCoalitions({
        where: { id: In(createOrganizationDto.activity.coalitions) },
      });
    }

    let branches = [];
    if (createOrganizationDto.activity.hasBranches) {
      if (createOrganizationDto.activity.branches) {
        throw new BadRequestException({
          message: HTTP_ERRORS_MESSAGES.MISSING_BRANCHES,
          errorCode: ERROR_CODES.ORG007,
        });
      }

      branches = await this.nomenclaturesService.getCities({
        where: { id: In(createOrganizationDto.activity.branches) },
      });
    }

    const domains = await this.nomenclaturesService.getDomains({
      where: { id: In(createOrganizationDto.activity.domains) },
    });

    // get anaf data
    const financialInformation = await this.anafService.getFinancialInformation(
      createOrganizationDto.general.cui,
      new Date().getFullYear() - 1,
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
      organizationFinancial: [
        {
          type: FinancialType.EXPENSE,
          year: new Date().getFullYear() - 1,
          total: financialInformation.totalExpense,
          numberOfEmployees: financialInformation.numberOfEmployees,
        },
        {
          type: FinancialType.INCOME,
          year: new Date().getFullYear() - 1,
          total: financialInformation.totalIncome,
          numberOfEmployees: financialInformation.numberOfEmployees,
        },
      ],
      organizationReport: {
        reports: [{}],
        partners: [{}],
        investors: [{}],
      },
    });
  }

  public async findOne(id: number): Promise<Organization> {
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
      ],
    });

    if (!organization) {
      throw new NotFoundException({
        message: HTTP_ERRORS_MESSAGES.ORGANIZATION,
        errorCode: ERROR_CODES.ORG001,
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
    const organization = await this.organizationRepository.get({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException({
        message: HTTP_ERRORS_MESSAGES.ORGANIZATION,
        errorCode: ERROR_CODES.ORG002,
      });
    }

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
      return this.organizationFinancialService.update(
        updateOrganizationDto.financial,
      );
    }

    if (updateOrganizationDto.report) {
      return this.organizationReportService.update(
        organization.organizationReportId,
        updateOrganizationDto.report,
      );
    }

    return null;
  }

  public async upload(
    organizationId: string,
    files: OrganizationFiles,
  ): Promise<{
    logo: string;
    organizationStatute: string;
  }> {
    const response = {
      logo: null,
      organizationStatute: null,
    };

    try {
      if (files.logo) {
        response.logo = await this.uploadFilesToBucket(
          `${organizationId}/${ORGANIZATION_FILES_DIR.LOGO}`,
          files.logo,
        );

        await this.organizationGeneralService.update(+organizationId, {
          logo: response.logo,
        });
      }

      if (files.organizationStatute) {
        response.organizationStatute = await this.uploadFilesToBucket(
          `${organizationId}/${ORGANIZATION_FILES_DIR.STATUTE}`,
          files.organizationStatute,
        );

        await this.organizationLegalService.update(+organizationId, {
          organizationStatute: response.organizationStatute,
        });
      }

      return response;
    } catch (error) {
      throw new BadRequestException({
        message: HTTP_ERRORS_MESSAGES.UPLOAD_FILES,
        errorCode: ERROR_CODES.ORG010,
        error: error,
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
        message: HTTP_ERRORS_MESSAGES.ORGANIZATION,
        errorCode: ERROR_CODES.ORG002,
      });
    }

    await this.organizationReportService.updatePartner(
      partnerId,
      numberOfPartners,
      `${organizationId}/${ORGANIZATION_FILES_DIR.PARTNERS}`,
      files,
    );

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
        message: HTTP_ERRORS_MESSAGES.ORGANIZATION,
        errorCode: ERROR_CODES.ORG002,
      });
    }

    await this.organizationReportService.updateInvestor(
      investorId,
      numberOfInvestors,
      `${organizationId}/${ORGANIZATION_FILES_DIR.INVESTORS}`,
      files,
    );

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
        message: HTTP_ERRORS_MESSAGES.ORGANIZATION,
        errorCode: ERROR_CODES.ORG002,
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
        message: HTTP_ERRORS_MESSAGES.ORGANIZATION,
        errorCode: ERROR_CODES.ORG002,
      });
    }

    await this.organizationReportService.deleteInvestor(investorId);

    return this.organizationReportService.findOne(
      organization.organizationReportId,
    );
  }

  private async uploadFilesToBucket(
    path: string,
    files: Express.Multer.File[],
    fileName?: string,
  ): Promise<string> {
    // upload new file
    const uploadedFile = await this.fileManagerService.uploadFiles(
      path,
      files,
      fileName,
    );

    // generate public link to file
    return this.fileManagerService.generatePresignedURL(uploadedFile[0]);
  }
}
