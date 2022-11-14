import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FILE_ERRORS } from 'src/shared/constants/file-errors.constants';
import { FILE_TYPE } from 'src/shared/enum/FileType.enum';
import { FileManagerService } from 'src/shared/services/file-manager.service';
import { In } from 'typeorm';
import { ORGANIZATION_ERRORS } from '../constants/errors.constants';
import { UpdateOrganizationLegalDto } from '../dto/update-organization-legal.dto';
import { OrganizationLegalRepository } from '../repositories';
import { ContactService } from './contact.service';

@Injectable()
export class OrganizationLegalService {
  private readonly logger = new Logger(OrganizationLegalService.name);
  constructor(
    private readonly organizationLegalRepostory: OrganizationLegalRepository,
    private readonly contactService: ContactService,
    private readonly fileManagerService: FileManagerService,
  ) {}

  public async update(
    id: number,
    updateOrganizationLegalDto: UpdateOrganizationLegalDto,
    organizationStatutePath?: string,
    organizationStatute?: Express.Multer.File[],
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
          organizationStatutePath,
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
        const err = error?.response;
        switch (err?.errorCode) {
          case FILE_ERRORS.IMAGE.errorCode:
            throw new BadRequestException({
              ...FILE_ERRORS.IMAGE,
              error,
            });
          case FILE_ERRORS.SIZE.errorCode:
            throw new BadRequestException({
              ...FILE_ERRORS.SIZE,
              error,
            });
          default:
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

    return organizationLegal;
  }
}
