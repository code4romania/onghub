import { Injectable } from '@nestjs/common';
import { UpdateOrganizationActivityDto } from '../dto/update-organization-activity.dto';
import { UpdateOrganizationFinancialDto } from '../dto/update-organization-financial.dto';
import { OrganizationFinancialRepository } from '../repositories';

@Injectable()
export class OrganizationFinancialService {
  constructor(
    private readonly organizationFinancialRepository: OrganizationFinancialRepository,
  ) {}

  public async update(
    id: number,
    updateOrganizationFinancialDto: UpdateOrganizationFinancialDto,
  ) {
    // return this.organizationFinancialRepository.update(
    //   { id },
    //   {
    //     ...updateOrganizationFinancialDto,
    //   },
    // );
  }
}
