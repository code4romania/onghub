import { Injectable } from '@nestjs/common';
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
  ) {}

  public async update(
    id: number,
    updateOrganizationGeneralDto: UpdateOrganizationGeneralDto,
  ) {
    const { contact, ...updateOrganizationData } = updateOrganizationGeneralDto;

    if (contact) {
      const contactEntity = await this.contactService.get({
        where: { id: contact.id },
      });
      updateOrganizationData['contact'] = { ...contactEntity, ...contact };
    }

    await this.organizationGeneralRepository.save({
      id,
      ...updateOrganizationData,
    });

    return this.organizationGeneralRepository.get({
      where: { id },
      relations: ['city', 'county', 'contact'],
    });
  }

  public async findOne(
    options: FindOneOptions<OrganizationGeneral>,
  ): Promise<OrganizationGeneral> {
    return this.organizationGeneralRepository.get(options);
  }
}
