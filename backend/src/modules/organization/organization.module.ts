import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  OrganizationGeneral,
  Organization,
  OrganizationActivity,
  OrganizationLegal,
  Contact,
  OrganizationFinancial,
  OrganizationReport,
  Report,
  Partner,
  Investor,
} from './entities';
import {
  ContactRepository,
  InvestorRepository,
  OrganizationActivityRepository,
  OrganizationFinancialRepository,
  OrganizationGeneralRepository,
  OrganizationLegalRepository,
  OrganizationReportRepository,
  OrganizationRepository,
  PartnerRepository,
} from './repositories';
import {
  ContactService,
  OrganizationActivityService,
  OrganizationFinancialService,
  OrganizationGeneralService,
  OrganizationLegalService,
  OrganizationService,
  ReportService,
} from './services';
import { OrganizationReportService } from './services/organization-report.service';
import { OrganizationProfileController } from './organization-profile.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contact,
      Organization,
      OrganizationGeneral,
      OrganizationActivity,
      OrganizationLegal,
      OrganizationFinancial,
      OrganizationReport,
      Report,
      Partner,
      Investor,
    ]),
  ],
  controllers: [OrganizationController, OrganizationProfileController],
  providers: [
    ContactService,
    OrganizationService,
    OrganizationGeneralService,
    OrganizationRepository,
    OrganizationGeneralRepository,
    OrganizationActivityService,
    OrganizationActivityRepository,
    OrganizationLegalRepository,
    PartnerRepository,
    InvestorRepository,
    ContactRepository,
    OrganizationLegalService,
    OrganizationFinancialRepository,
    OrganizationFinancialService,
    OrganizationReportRepository,
    OrganizationReportService,
    ReportService,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
