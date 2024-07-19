import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FILE_TYPE } from 'src/shared/enum/FileType.enum';
import { S3FileManagerService } from 'src/shared/services/s3-file-manager.service';
import { In } from 'typeorm';
import { ORGANIZATION_ERRORS } from '../constants/errors.constants';
import { UpdateOrganizationLegalDto } from '../dto/update-organization-legal.dto';
import { OrganizationLegalRepository } from '../repositories';
import { ContactService } from './contact.service';
import { ORGANIZATION_FILES_DIR } from '../constants/files.constants';

@Injectable()
export class OrganizationLegalService {
  private readonly logger = new Logger(OrganizationLegalService.name);
  constructor(
    private readonly organizationLegalRepostory: OrganizationLegalRepository,
    private readonly contactService: ContactService,
    private readonly fileManagerService: S3FileManagerService,
  ) {}

  public async update(
    id: number,
    updateOrganizationLegalDto: UpdateOrganizationLegalDto,
    organizationStatute?: Express.Multer.File[],
    nonPoliticalAffiliationFile?: Express.Multer.File[],
  ) {
    const orgLegal = await this.organizationLegalRepostory.get({
      where: { id },
    });

    if (!orgLegal) {
      throw new NotFoundException({
        ...ORGANIZATION_ERRORS.GET_REPORT,
      });
    }

    let { directorsDeleted, ...organizationLegalData } =
      updateOrganizationLegalDto;

    if (updateOrganizationLegalDto?.directors?.length < 3) {
      throw new BadRequestException({
        ...ORGANIZATION_ERRORS.CREATE_LEGAL.DIRECTORS_MIN,
      });
    }

    if (directorsDeleted?.length > 0) {
      await this.contactService.delete({ where: { id: In(directorsDeleted) } });
    }

    // Update organization statute file if necessary
    if (organizationStatute) {
      if (orgLegal.organizationStatute) {
        await this.fileManagerService.deleteFiles([
          orgLegal.organizationStatute,
        ]);
      }

      try {
        const uploadedFile = await this.fileManagerService.uploadFiles(
          `${id}/${ORGANIZATION_FILES_DIR.STATUTE}`,
          organizationStatute,
          FILE_TYPE.FILE,
        );

        organizationLegalData = {
          ...organizationLegalData,
          organizationStatute: uploadedFile[0],
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

    // Non Political Affiliation File
    if (nonPoliticalAffiliationFile) {
      if (orgLegal.nonPoliticalAffiliationFile) {
        await this.fileManagerService.deleteFiles([
          orgLegal.nonPoliticalAffiliationFile,
        ]);
      }

      try {
        const uploadedFile = await this.fileManagerService.uploadFiles(
          `${id}/${ORGANIZATION_FILES_DIR.NON_POLITICAL_AFFILITION}`,
          nonPoliticalAffiliationFile,
          FILE_TYPE.FILE,
        );

        organizationLegalData = {
          ...organizationLegalData,
          nonPoliticalAffiliationFile: uploadedFile[0],
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

    await this.organizationLegalRepostory.save({
      id,
      ...organizationLegalData,
      others: organizationLegalData?.others || null,
    });

    let organizationLegal = await this.organizationLegalRepostory.get({
      where: { id },
      relations: ['directors', 'legalReprezentative'],
    });

    if (organizationLegal.organizationStatute) {
      const organizationStatutePublicUrl =
        await this.fileManagerService.generatePresignedURL(
          organizationLegal.organizationStatute,
        );
      organizationLegal = {
        ...organizationLegal,
        organizationStatute: organizationStatutePublicUrl,
      };
    }

    if (organizationLegal.nonPoliticalAffiliationFile) {
      const nonPoliticalAffiliationFilePublicUrl =
        await this.fileManagerService.generatePresignedURL(
          organizationLegal.nonPoliticalAffiliationFile,
        );
      organizationLegal = {
        ...organizationLegal,
        nonPoliticalAffiliationFile: nonPoliticalAffiliationFilePublicUrl,
      };
    }

    return organizationLegal;
  }

  public async deleteOrganizationStatute(
    organizationLegalId: number,
  ): Promise<void> {
    try {
      // 1. Query organization legal data
      const organizationLegal = await this.organizationLegalRepostory.get({
        where: { id: organizationLegalId },
      });

      if (organizationLegal?.organizationStatute) {
        // 2. remove file from s3
        await this.fileManagerService.deleteFiles([
          organizationLegal.organizationStatute,
        ]);

        // 3. remove path from database
        await this.organizationLegalRepostory.save({
          ...organizationLegal,
          organizationStatute: null,
        });
      }
    } catch (error) {
      this.logger.error({
        error,
        ...ORGANIZATION_ERRORS.DELETE.STATUTE,
      });

      const err = error?.response;
      throw new InternalServerErrorException({
        ...ORGANIZATION_ERRORS.DELETE.STATUTE,
        error: err,
      });
    }
  }
}
