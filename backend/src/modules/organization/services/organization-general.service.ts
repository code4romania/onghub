import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FILE_TYPE } from 'src/shared/enum/FileType.enum';
import { S3FileManagerService } from 'src/shared/services/s3-file-manager.service';
import { FindOneOptions } from 'typeorm';
import {
  ORGANIZATION_ERRORS,
  ORGANIZATION_REQUEST_ERRORS,
} from '../constants/errors.constants';
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
    const errors = [];

    // 1. Validate unicity of received data
    // 1.1 For NGO name
    if (updateOrganizationData.name) {
      const checkOrganizationName =
        await this.organizationGeneralRepository.get({
          where: { name: updateOrganizationData.name },
        });
      if (checkOrganizationName) {
        errors.push(
          new BadRequestException(
            ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_NAME_EXISTS,
          ),
        );
      }
    }

    // 1.2 For NGO alias
    if (updateOrganizationData.alias) {
      const checkOrganizationAlias =
        await this.organizationGeneralRepository.get({
          where: { alias: updateOrganizationData.alias },
        });
      console.log(checkOrganizationAlias);
      if (checkOrganizationAlias) {
        errors.push(
          new BadRequestException(
            ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_ALIAS_EXISTS,
          ),
        );
      }
    }

    // 1.3 For NGO email
    if (updateOrganizationData.email) {
      const checkOrganizationEmail =
        await this.organizationGeneralRepository.get({
          where: { email: updateOrganizationData.email },
        });
      if (checkOrganizationEmail) {
        errors.push(
          new BadRequestException(
            ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_EMAIL_EXISTS,
          ),
        );
      }
    }

    // 1.4 For NGO phone
    if (updateOrganizationData.phone) {
      const checkOrganizationPhone =
        await this.organizationGeneralRepository.get({
          where: { phone: updateOrganizationData.phone },
        });
      if (checkOrganizationPhone) {
        errors.push(
          new BadRequestException(
            ORGANIZATION_REQUEST_ERRORS.CREATE.ORGANIZATION_PHONE_EXISTS,
          ),
        );
      }
    }

    if (contact) {
      const contactEntity = await this.contactService.get({
        where: { id: contact.id },
      });
      updateOrganizationData['contact'] = { ...contactEntity, ...contact };
    }

    if (logo) {
      if (updateOrganizationGeneralDto.logo) {
        await this.fileManagerService.deleteFiles([
          updateOrganizationGeneralDto.logo,
        ]);
      }

      try {
        const uploadedFile = await this.fileManagerService.uploadFiles(
          logoPath,
          logo,
          FILE_TYPE.IMAGE,
        );

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
          errors.push(error);
        } else {
          errors.push(
            new InternalServerErrorException({
              ...ORGANIZATION_ERRORS.UPLOAD,
              error,
            }),
          );
        }
      }
    }

    if (errors.length) {
      throw new BadRequestException(errors);
    }

    await this.organizationGeneralRepository.save({
      id,
      ...updateOrganizationData,
    });

    let organizationGeneral = await this.organizationGeneralRepository.get({
      where: { id },
      relations: ['city', 'county', 'contact'],
    });

    if (logo) {
      const logoPublicUrl = await this.fileManagerService.generatePresignedURL(
        organizationGeneral.logo,
      );
      organizationGeneral = {
        ...organizationGeneral,
        logo: logoPublicUrl,
      };
    }

    return organizationGeneral;
  }

  public async findOne(
    options: FindOneOptions<OrganizationGeneral>,
  ): Promise<OrganizationGeneral> {
    return this.organizationGeneralRepository.get(options);
  }
}
