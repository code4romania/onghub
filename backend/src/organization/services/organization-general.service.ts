import { Injectable } from '@nestjs/common';
import { UpdateOrganizationGeneralDto } from '../dto/update-organization-general.dto';
import { OrganizationGeneralRepository } from '../repositories/organization-general.repository';

@Injectable()
export class OrganizationGeneralService {
  constructor(
    private readonly organizationGeneralRepository: OrganizationGeneralRepository,
  ) {}

  public update(
    id: number,
    updateOrganizationGeneralDto: UpdateOrganizationGeneralDto,
  ) {
    return this.organizationGeneralRepository.update(
      { id },
      updateOrganizationGeneralDto,
    );
  }
}
