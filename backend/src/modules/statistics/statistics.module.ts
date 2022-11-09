import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from '../application/application.module';
import { CivicCenterModule } from '../civic-center-service/civic-center.module';
import { OrganizationModule } from '../organization/organization.module';
import { PracticeProgramModule } from '../practice-program/practice-program.module';
import { UserModule } from '../user/user.module';
import { StatisticsController } from './controllers/statistics.controller';
import { OrganizationStatusStatisticsView } from './entities/organization-status-statistics-view.entity';
import { OrganizatioStatusnStatisticsViewRepository } from './repositories/organization-status-statistics-view.repository';
import { StatisticsService } from './services/statistics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationStatusStatisticsView]),
    OrganizationModule,
    UserModule,
    ApplicationModule,
    PracticeProgramModule,
    CivicCenterModule,
  ],
  controllers: [StatisticsController],
  providers: [OrganizatioStatusnStatisticsViewRepository, StatisticsService],
})
export class StatisticsModule {}
