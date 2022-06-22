import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrganizationGeneralMock } from './mocks/organization.mock';
import { OrganizationService } from './services/organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  create(@Body() createOrganizationDto: any) {
    // return this.organizationService.create(createOrganizationDto);
    return this.organizationService.create(OrganizationGeneralMock);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationService.findOne(+id);
  }
}
