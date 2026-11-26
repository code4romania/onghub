import { Module } from '@nestjs/common';
import { CivicCenterModule } from '../civic-center-service/civic-center.module';
import { OrganizationModule } from '../organization/organization.module';
import { PracticeProgramModule } from '../practice-program/practice-program.module';
import { CivicCenterPublicController } from './controllers/civic-center-public.controller';
import { PracticeProgramPublicController } from './controllers/practice-program-public.controller';
import { PublicAPIController } from './controllers/public-api.controller';
import { CivicCenterPublicService } from './services/civic-center-public.service';
import { PracticeProgramPublicService } from './services/practice-program-public.service';

@Module({
  imports: [OrganizationModule, CivicCenterModule, PracticeProgramModule],
  controllers: [
    PublicAPIController,
    CivicCenterPublicController,
    PracticeProgramPublicController,
  ],
  providers: [CivicCenterPublicService, PracticeProgramPublicService],
  exports: [],
})
export class PublicAPIModule {}
