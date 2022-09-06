import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationController } from './controllers/application.controller';
import { Application } from './entities/application.entity';
import { ApplicationRepository } from './repositories/application.repository';
import { ApplicationService } from './services/application.service';
import { SharedModule } from 'src/shared/shared.module';
import { OngApplication } from './entities/ong-application.entity';
import { OngApplicationRepository } from './repositories/ong-application.repository';
import { OngApplicationService } from './services/ong-application.service';
import { OrganizationApplicationController } from './controllers/organization-application.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, OngApplication]),
    SharedModule,
  ],
  controllers: [ApplicationController, OrganizationApplicationController],
  providers: [
    ApplicationService,
    ApplicationRepository,
    OngApplicationRepository,
    OngApplicationService,
  ],
  exports: [OngApplicationService, ApplicationService],
})
export class ApplicationModule {}
