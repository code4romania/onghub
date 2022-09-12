import { forwardRef, Module } from '@nestjs/common';
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
  OrganizationView,
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
  OrganizationViewRepository,
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
import { ApplicationModule } from '../application/application.module';
import { OrganizationRequest } from './entities/organization-request.entity';
import { OrganizationRequestRepository } from './repositories/organization-request.repository';
import { OrganizationRequestService } from './services/organization-request.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contact,
      Organization,
      OrganizationView,
      OrganizationGeneral,
      OrganizationActivity,
      OrganizationLegal,
      OrganizationFinancial,
      OrganizationReport,
      Report,
      Partner,
      Investor,
      OrganizationRequest,
    ]),
    ApplicationModule,
    UserModule,
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
    OrganizationViewRepository,
    OrganizationRequestRepository,
    OrganizationRequestService,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
