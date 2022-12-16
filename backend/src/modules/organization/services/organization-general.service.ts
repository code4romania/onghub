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
import { FindOneOptions } from 'typeorm';
import {
  ORGANIZATION_ERRORS,
  ORGANIZATION_REQUEST_ERRORS,
} from '../constants/errors.constants';
import { ORGANIZATION_EVENTS } from '../constants/events.constants';
import { UpdateOrganizationGeneralDto } from '../dto/update-organization-general.dto';
import { Organization, OrganizationGeneral } from '../entities';
import CUIChangedEvent from '../events/CUI-changed-event.class';
import { OrganizationGeneralRepository } from '../repositories/organization-general.repository';
import { ContactService } from './contact.service';

@Injectable()
export class OrganizationGeneralService {
  private readonly logger = new Logger(OrganizationGeneralService.name);
  constructor(
    private readonly organizationGeneralRepository: OrganizationGeneralRepository,
    private readonly contactService: ContactService,
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

    // Validation 1: Check if the CUI has changed to update the financial data
    if (updateOrganizationGeneralDto.cui !== currentCUI) {
      this.eventEmitter.emit(
        ORGANIZATION_EVENTS.CUI_CHANGED,
        new CUIChangedEvent(organization.id, updateOrganizationGeneralDto.cui),
      );
    }

    let { contact, ...updateOrganizationData } = updateOrganizationGeneralDto;
    const errors = [];

    // 1. Validate unicity of received data
    const organizationGenerals =
      await this.organizationGeneralRepository.getMany({});
    for (let i = 0; i < organizationGenerals.length; i++) {
      if (organizationGenerals[i].name === updateOrganizationData?.name) {
        errors.push(
          ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_NAME_EXISTS,
        );
      }
      if (organizationGenerals[i].alias === updateOrganizationData?.alias) {
        errors.push(
          ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_ALIAS_EXISTS,
        );
      }
      if (organizationGenerals[i].email === updateOrganizationData?.email) {
        errors.push(
          ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_EMAIL_EXISTS,
        );
      }
      if (organizationGenerals[i].phone === updateOrganizationData?.phone) {
        errors.push(
          ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_PHONE_EXISTS,
        );
      }
    }

    // 2. handle contact upload
    // TODO: this will be deprecated
    if (contact) {
      const contactEntity = await this.contactService.get({
        where: { id: contact.id },
      });
      updateOrganizationData['contact'] = { ...contactEntity, ...contact };
    }

    // 3. handle logo
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
        updateOrganizationData = {
          ...updateOrganizationData,
          logo: uploadedFile[0],
        };
      } catch (error) {
        this.logger.error({
          error: { error },
          ...ORGANIZATION_ERRORS.UPLOAD,
        });
        errors.push(ORGANIZATION_ERRORS.UPLOAD);
      }
    }

    if (errors.length) {
      throw new BadRequestException(errors);
    }

    // 4. Save organization general data
    try {
      await this.organizationGeneralRepository.save({
        id: organization.organizationGeneral.id,
        ...updateOrganizationData,
      });

      let organizationGeneral = await this.organizationGeneralRepository.get({
        where: { id: organization.organizationGeneralId },
        relations: ['city', 'county', 'contact'],
      });

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
}
