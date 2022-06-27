import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  OrganizationGeneral,
  Organization,
  OrganizationActivity,
  OrganizationLegal,
  Contact,
} from './entities';
import {
  OrganizationActivityRepository,
  OrganizationGeneralRepository,
  OrganizationLegalRepository,
  OrganizationRepository,
} from './repositories';
import {
  ContactService,
  OrganizationActivityService,
  OrganizationGeneralService,
  OrganizationLegalService,
  OrganizationService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contact,
      Organization,
      OrganizationGeneral,
      OrganizationActivity,
      OrganizationLegal,
    ]),
  ],
  controllers: [OrganizationController],
  providers: [
    ContactService,
    OrganizationService,
    OrganizationGeneralService,
    OrganizationRepository,
    OrganizationGeneralRepository,
    OrganizationActivityService,
    OrganizationActivityRepository,
    OrganizationLegalRepository,
    OrganizationLegalService,
  ],
})
export class OrganizationModule {}
