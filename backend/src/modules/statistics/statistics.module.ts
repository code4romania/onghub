import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from '../application/application.module';
import { OrganizationModule } from '../organization/organization.module';
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
  ],
  controllers: [StatisticsController],
  providers: [OrganizatioStatusnStatisticsViewRepository, StatisticsService],
})
export class StatisticsModule {}
