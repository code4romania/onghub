import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from '../application/application.module';
import { UserModule } from '../user/user.module';
import { OrganizationApplicationController } from './controllers/organization-application.controller';
import { OrganizationProfileController } from './controllers/organization-profile.controller';
import { OrganizationController } from './controllers/organization.controller';
import {
  Contact,
  Investor,
  Organization,
  OrganizationActivity,
  OrganizationFinancial,
  OrganizationGeneral,
  OrganizationLegal,
  OrganizationReport,
  OrganizationView,
  Partner,
  Report,
} from './entities';
import { OrganizationRequest } from './entities/organization-request.entity';
import { OrganizationStatisticsView } from './entities/organization-statistics-view.entity';
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
  OrganizationStatisticsViewRepository,
} from './repositories';
import { OrganizationRequestRepository } from './repositories/organization-request.repository';
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
import { OrganizationRequestService } from './services/organization-request.service';
import { OrganizationStatisticsService } from './services/organization-statistics.service';

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
      OrganizationRequest,
      OrganizationView,
      OrganizationStatisticsView,
    ]),
    ApplicationModule,
    UserModule,
  ],
  controllers: [
    OrganizationApplicationController,
    OrganizationController,
    OrganizationProfileController,
  ],
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
    OrganizationStatisticsService,
    OrganizationStatisticsViewRepository,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}
