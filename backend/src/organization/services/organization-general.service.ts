import { Injectable } from '@nestjs/common';
import { CreateOrganizationGeneralDto } from '../dto/create-organization-general.dto';
import { OrganizationGeneralRepository } from '../repositories/organization-general.repository';

@Injectable()
export class OrganizationGeneralService {
  constructor(
    private readonly organizationGeneralRepository: OrganizationGeneralRepository,
  ) {}

  create(createOrganizationGeneralDto: CreateOrganizationGeneralDto) {
    // create the parent entry with default values
    return this.organizationGeneralRepository.save({});
  }

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

  // update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
  //   return `This action updates a #${id} organization`;
  // }
}
