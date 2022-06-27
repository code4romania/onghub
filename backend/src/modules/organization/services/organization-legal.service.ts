import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { UpdateOrganizationLegalDto } from '../dto/update-organization-legal.dto';
import { OrganizationLegalRepository } from '../repositories';
import { ContactService } from './contact.service';

@Injectable()
export class OrganizationLegalService {
  constructor(
    private readonly organizationLegalRepostory: OrganizationLegalRepository,
    private readonly contactService: ContactService,
  ) {}

  public async update(
    id: number,
    updateOrganizationLegalDto: UpdateOrganizationLegalDto,
  ) {
    const { legalReprezentative, directors, ...updateOrganizationData } =
      updateOrganizationLegalDto;

    // set local representative
    if (legalReprezentative) {
      const legalRepresentativeEntity = await this.contactService.get({
        where: { id: legalReprezentative.id },
      });
      updateOrganizationData['legalReprezentative'] = {
        ...legalRepresentativeEntity,
        ...legalReprezentative,
      };
    }

    // set directors
    if (directors?.length > 0) {
      const ids = directors.map((director) => director.id);
      const directorsEntities = await this.contactService.getMany({
        where: {
          id: In(ids),
        },
      });

      const updateDirectors = directorsEntities.map((director) => {
        return {
          ...director,
          ...directors.find((item) => item.id === director.id),
        };
      });

      updateOrganizationData['directors'] = updateDirectors;
    }

    return this.organizationLegalRepostory.save({
      id,
      ...updateOrganizationData,
    });
  }
}
