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

@Injectable()
export class OrganizationGeneralService {
  private readonly logger = new Logger(OrganizationGeneralService.name);
  constructor(
    private readonly organizationGeneralRepository: OrganizationGeneralRepository,
    private readonly fileManagerService: S3FileManagerService,
  ) {}

  public async update(
    id: number,
    updateOrganizationGeneralDto: UpdateOrganizationGeneralDto,
    logoPath?: string,
    logo?: Express.Multer.File[],
  ) {
    let { ...updateOrganizationData } = updateOrganizationGeneralDto;

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
          throw error;
        } else {
          throw new InternalServerErrorException({
            ...ORGANIZATION_ERRORS.UPLOAD,
            error,
          });
        }
      }
    }

    await this.organizationGeneralRepository.save({
      id,
      ...updateOrganizationData,
    });

    let organizationGeneral = await this.organizationGeneralRepository.get({
      where: { id },
      relations: ['city', 'county'],
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
