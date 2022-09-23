import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationController } from './controllers/application.controller';
import { Application } from './entities/application.entity';
import { ApplicationRepository } from './repositories/application.repository';
import { ApplicationService } from './services/application.service';
import { SharedModule } from 'src/shared/shared.module';
import { OngApplication } from './entities/ong-application.entity';
import { OngApplicationRepository } from './repositories/ong-application.repository';
import { OngApplicationService } from './services/ong-application.service';
import { ApplicationRequest } from './entities/application-request.entity';
import { ApplicationRequestRepository } from './repositories/application-request.repository';
import { ApplicationRequestService } from './services/application-request.service';
import { ApplicationRequestController } from './controllers/application-request.controller';
import { UserOngApplication } from './entities/user-ong-application.entity';
import { UserOngApplicationRepository } from './repositories/user-ong-application.repository';
import { UserOngApplicationService } from './services/user-ong-application.service';
import { ApplicationOngView } from './entities/application-ong-view.entity';
import { ApplicationOngViewRepository } from './repositories/application-ong-view.repository';
import { ApplicationTableView } from './entities/application-table-view.entity';
import { ApplicationTableViewRepository } from './repositories/application-table-view.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application,
      OngApplication,
      ApplicationRequest,
      UserOngApplication,
      ApplicationTableView,
      ApplicationOngView,
    ]),
    SharedModule,
    UserModule,
  ],
  controllers: [ApplicationRequestController, ApplicationController],
  providers: [
    ApplicationService,
    ApplicationRepository,
    OngApplicationRepository,
    OngApplicationService,
    ApplicationRequestRepository,
    ApplicationRequestService,
    UserOngApplicationRepository,
    UserOngApplicationService,
    ApplicationTableViewRepository,
    ApplicationOngViewRepository,
  ],
  exports: [
    OngApplicationService,
    ApplicationService,
    UserOngApplicationService,
    ApplicationRequestService,
  ],
})
export class ApplicationModule {}
