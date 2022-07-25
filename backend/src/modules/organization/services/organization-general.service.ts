import { Injectable } from '@nestjs/common';
import { UpdateOrganizationGeneralDto } from '../dto/update-organization-general.dto';
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
}
