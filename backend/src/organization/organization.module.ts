import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import {
  OrganizationGeneral,
  Organization,
  OrganizationActivity,
  ActivityToCity,
  ActivityToDomain,
} from './entities';
import {
  OrganizationGeneralRepository,
  OrganizationRepository,
} from './repositories';
import { OrganizationGeneralService, OrganizationService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      OrganizationGeneral,
      OrganizationActivity,
      ActivityToCity,
      ActivityToDomain,
    ]),
    CommonModule,
  ],
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    OrganizationGeneralService,
    OrganizationRepository,
    OrganizationGeneralRepository,
  ],
})
export class OrganizationModule {}
