import { Injectable } from '@nestjs/common';
import { ContactService } from 'src/shared/services';
import { UpdateOrganizationGeneralDto } from '../dto/update-organization-general.dto';
import { OrganizationGeneralRepository } from '../repositories/organization-general.repository';

@Injectable()
export class OrganizationGeneralService {
  constructor(
    private readonly organizationGeneralRepository: OrganizationGeneralRepository,
    private readonly contactService: ContactService,
  ) {}

  public update(
    id: number,
    updateOrganizationGeneralDto: UpdateOrganizationGeneralDto,
  ) {
    const { contact, ...updateOrganizationData } = updateOrganizationGeneralDto;

    if (contact) {
      const contactEntity = this.contactService.get({
        where: { id: contact.id },
      });
      updateOrganizationData['contact'] = { ...contactEntity, ...contact };
    }

    return this.organizationGeneralRepository.save({
      id,
      ...updateOrganizationData,
    });
  }
}
