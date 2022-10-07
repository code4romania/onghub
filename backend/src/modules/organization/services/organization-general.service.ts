import { Injectable } from '@nestjs/common';
import { FileManagerService } from 'src/shared/services/file-manager.service';
import { FindOneOptions } from 'typeorm';
import { UpdateOrganizationGeneralDto } from '../dto/update-organization-general.dto';
import { OrganizationGeneral } from '../entities';
import { OrganizationGeneralRepository } from '../repositories/organization-general.repository';
import { ContactService } from './contact.service';

@Injectable()
export class OrganizationGeneralService {
  constructor(
    private readonly organizationGeneralRepository: OrganizationGeneralRepository,
    private readonly contactService: ContactService,
    private readonly fileManagerService: FileManagerService,
  ) {}

  public async update(
    id: number,
    updateOrganizationGeneralDto: UpdateOrganizationGeneralDto,
    logoPath?: string,
    logo?: Express.Multer.File[],
  ) {
    let { contact, ...updateOrganizationData } = updateOrganizationGeneralDto;

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

      const uploadedFile = await this.fileManagerService.uploadFiles(
        logoPath,
        logo,
      );

      updateOrganizationData = {
        ...updateOrganizationData,
        logo: uploadedFile[0],
      };
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
