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
import { ApplicationRequestController } from './controllers/application-request.controller';
import { UserOngApplication } from './entities/user-ong-application.entity';
import { UserOngApplicationRepository } from './repositories/user-ong-application.repository';
import { UserOngApplicationService } from './services/user-ong-application.service';
import { ApplicationOngView } from './entities/application-ong-view.entity';
import { ApplicationOngViewRepository } from './repositories/application-ong-view.repository';
import { ApplicationTableView } from './entities/application-table-view.entity';
import { ApplicationTableViewRepository } from './repositories/application-table-view.repository';
import { ApplicationHistory } from './entities/application-history.entity';
import { OngApplicationHistory } from './entities/ong-application-history.entity';
import { OrganizationApplicationController } from './controllers/organization-application.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application,
      OngApplication,
      UserOngApplication,
      ApplicationTableView,
      ApplicationOngView,
      ApplicationHistory,
      OngApplicationHistory,
    ]),
    SharedModule,
  ],
  controllers: [
    ApplicationRequestController,
    ApplicationController,
    OrganizationApplicationController,
  ],
  providers: [
    ApplicationService,
    ApplicationRepository,
    OngApplicationRepository,
    OngApplicationService,
    UserOngApplicationRepository,
    UserOngApplicationService,
    ApplicationTableViewRepository,
    ApplicationOngViewRepository,
  ],
  exports: [
    OngApplicationService,
    ApplicationService,
    UserOngApplicationService,
  ],
})
export class ApplicationModule {}
