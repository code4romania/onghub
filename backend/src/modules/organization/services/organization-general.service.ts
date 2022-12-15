import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FILE_TYPE } from 'src/shared/enum/FileType.enum';
import { S3FileManagerService } from 'src/shared/services/s3-file-manager.service';
import { FindOneOptions } from 'typeorm';
import { ORGANIZATION_ERRORS } from '../constants/errors.constants';
import { UpdateOrganizationGeneralDto } from '../dto/update-organization-general.dto';
import { OrganizationGeneral } from '../entities';
import { OrganizationGeneralRepository } from '../repositories/organization-general.repository';
import { ContactService } from './contact.service';

@Injectable()
export class OrganizationGeneralService {
  private readonly logger = new Logger(OrganizationGeneralService.name);
  constructor(
    private readonly organizationGeneralRepository: OrganizationGeneralRepository,
    private readonly contactService: ContactService,
    private readonly fileManagerService: S3FileManagerService,
  ) {}

  public async update(
    id: number,
    updateOrganizationGeneralDto: UpdateOrganizationGeneralDto,
    logoPath?: string,
    logo?: Express.Multer.File[],
  ) {
    let { contact, ...updateOrganizationData } = updateOrganizationGeneralDto;

    // 1. handle contact upload
    // TODO: this will be deprecated
    if (contact) {
      const contactEntity = await this.contactService.get({
        where: { id: contact.id },
      });
      updateOrganizationData['contact'] = { ...contactEntity, ...contact };
    }

    // 2. handle logo
    if (logo) {
      try {
        // 2.1 Get logo path from database
        const organizationGeneral =
          await this.organizationGeneralRepository.get({
            where: { id },
          });

        //2.2 Remove logo if we have any
        if (organizationGeneral.logo) {
          await this.fileManagerService.deleteFiles([organizationGeneral.logo]);
        }

        //2.3 Upload new logo file to s3
        const uploadedFile = await this.fileManagerService.uploadFiles(
          logoPath,
          logo,
          FILE_TYPE.IMAGE,
        );

        // 2.4 Add new logo path to database
        updateOrganizationData = {
          ...updateOrganizationData,
          logo: uploadedFile[0],
        };
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
    }

    // 3. Save organization general data
    try {
      await this.organizationGeneralRepository.save({
        id,
        ...updateOrganizationData,
      });

      let organizationGeneral = await this.organizationGeneralRepository.get({
        where: { id },
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
