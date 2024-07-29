import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FILE_TYPE } from 'src/shared/enum/FileType.enum';
import { S3FileManagerService } from 'src/shared/services/s3-file-manager.service';
import { FindOneOptions, Not } from 'typeorm';
import {
  ORGANIZATION_ERRORS,
  ORGANIZATION_REQUEST_ERRORS,
} from '../constants/errors.constants';
import { ORGANIZATION_EVENTS } from '../constants/events.constants';
import { UpdateOrganizationGeneralDto } from '../dto/update-organization-general.dto';
import { Organization, OrganizationGeneral } from '../entities';
import CUIChangedEvent from '../events/CUI-changed-event.class';
import { OrganizationGeneralRepository } from '../repositories/organization-general.repository';

@Injectable()
export class OrganizationGeneralService {
  private readonly logger = new Logger(OrganizationGeneralService.name);
  constructor(
    private readonly organizationGeneralRepository: OrganizationGeneralRepository,
    private readonly fileManagerService: S3FileManagerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async update(
    organization: Organization,
    updateOrganizationGeneralDto: UpdateOrganizationGeneralDto,
    logoPath?: string,
    logo?: Express.Multer.File[],
  ) {
    const { cui: currentCUI, logo: currentLogoPath } =
      await this.organizationGeneralRepository.get({
        where: { id: organization.organizationGeneralId },
      });

    // Validation 1: FILES VALIDATION - type and size check
    this.fileManagerService.validateFiles(logo, FILE_TYPE.IMAGE);

    // Validation 2: UNIQUE - some values must be unique
    await this.validateDataUnicity(
      organization.organizationGeneralId,
      updateOrganizationGeneralDto,
    );

    // Processing 1: Save new logo
    if (logo) {
      try {
        //3.1 Remove logo if we have any
        if (currentLogoPath) {
          await this.fileManagerService.deleteFiles([currentLogoPath]);
        }

        //3.2 Upload new logo file to s3
        const uploadedFile = await this.fileManagerService.uploadFiles(
          logoPath,
          logo,
          FILE_TYPE.IMAGE,
        );

        // 3.3 Add new logo path to database
        updateOrganizationGeneralDto = {
          ...updateOrganizationGeneralDto,
          logo: uploadedFile[0],
        };
      } catch (error) {
        this.logger.error({
          error: { error },
          ...ORGANIZATION_ERRORS.UPLOAD,
        });
        throw new InternalServerErrorException(ORGANIZATION_ERRORS.UPLOAD);
      }
    }

    // Processing 2: Update the data
    try {
      await this.organizationGeneralRepository.save({
        id: organization.organizationGeneralId,
        ...updateOrganizationGeneralDto,
        organizationCityId:
          updateOrganizationGeneralDto.organizationCityId || null,
        organizationCountyId:
          updateOrganizationGeneralDto.organizationCountyId || null,
      });

      let organizationGeneral = await this.organizationGeneralRepository.get({
        where: { id: organization.organizationGeneralId },
        relations: [
          'city',
          'county',
          'organizationCounty',
          'organizationCity',
          'associationRegistryIssuer',
        ],
      });

      // Effect 1: Update financial data if CUI has changed
      if (updateOrganizationGeneralDto.cui !== currentCUI) {
        this.eventEmitter.emit(
          ORGANIZATION_EVENTS.CUI_CHANGED,
          new CUIChangedEvent(
            organization.id,
            updateOrganizationGeneralDto.cui,
          ),
        );
      }

      // Effect 2: Prepare the logo URL if the logo changed
      if (organizationGeneral.logo) {
        const logoPublicUrl =
          await this.fileManagerService.generatePresignedURL(
            organizationGeneral.logo,
          );
        organizationGeneral = {
          ...organizationGeneral,
          logo: logoPublicUrl,
        };
      }

      return organizationGeneral;
    } catch (error) {
      this.logger.error({
        error: { error },
        ...ORGANIZATION_ERRORS.UPDATE_GENERAL,
      });
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new InternalServerErrorException({
          ...ORGANIZATION_ERRORS.UPDATE_GENERAL,
          error,
        });
      }
    }
  }

  public async findOne(
    options: FindOneOptions<OrganizationGeneral>,
  ): Promise<OrganizationGeneral> {
    return this.organizationGeneralRepository.get(options);
  }

  private async validateDataUnicity(
    orgGeneralId: number,
    newDTO: UpdateOrganizationGeneralDto,
  ) {
    const errors = [];
    const existing = await this.organizationGeneralRepository.getMany({
      where: [
        { id: Not(orgGeneralId), name: newDTO?.name },
        { id: Not(orgGeneralId), alias: newDTO?.alias },
        { id: Not(orgGeneralId), email: newDTO?.email },
        { id: Not(orgGeneralId), phone: newDTO?.phone },
        {
          id: Not(orgGeneralId),
          nationalRegistryNumber: newDTO?.nationalRegistryNumber,
        },
        {
          id: Not(orgGeneralId),
          associationRegistryNumber: newDTO?.associationRegistryNumber,
        },
      ],
    });
    for (let i = 0; i < existing.length; i++) {
      if (existing[i].name === newDTO?.name) {
        errors.push(
          ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_NAME_EXISTS,
        );
      }
      if (existing[i].alias === newDTO?.alias) {
        errors.push(
          ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_ALIAS_EXISTS,
        );
      }
      if (existing[i].email === newDTO?.email) {
        errors.push(
          ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_EMAIL_EXISTS,
        );
      }
      if (existing[i].phone === newDTO?.phone) {
        errors.push(
          ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_PHONE_EXISTS,
        );
      }
      if (
        existing[i].nationalRegistryNumber === newDTO?.nationalRegistryNumber
      ) {
        errors.push(
          ORGANIZATION_REQUEST_ERRORS.CREATE.NATIONAL_REGISTRY_NUMBER_EXISTS,
        );
      }
      if (
        existing[i].associationRegistryNumber ===
        newDTO?.associationRegistryNumber
      ) {
        errors.push(
          ORGANIZATION_REQUEST_ERRORS.CREATE.ASSOCIATION_REGISTRY_NUMBER_EXISTS,
        );
      }
    }

    if (errors.length) {
      throw new BadRequestException(errors);
    }

    return;
  }
}
