import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrganizationGeneralDto } from '../dto/update-organization-general.dto';
import { OrganizationGeneral } from '../entities';
import { OrganizationGeneralRepository } from '../repositories/organization-general.repository';
import { ContactService } from './contact.service';
import {
  HTTP_ERRORS_MESSAGES,
  ERROR_CODES,
} from '../constants/errors.constants';

@Injectable()
export class OrganizationGeneralService {
  constructor(
    private readonly organizationGeneralRepository: OrganizationGeneralRepository,
    private readonly contactService: ContactService,
  ) {}

  public async findOne(id: number): Promise<OrganizationGeneral> {
    const organizationFinancial = await this.organizationGeneralRepository.get({
      where: { id },
      //relations: ['organization'],
    });

    if (!organizationFinancial) {
      throw new NotFoundException({
        message: HTTP_ERRORS_MESSAGES.ORGANIZATION,
        errorCode: ERROR_CODES.ORG001,
      });
    }

    return organizationFinancial;
  }

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

    return this.organizationGeneralRepository.save({
      id,
      ...updateOrganizationData,
    });
  }
}
