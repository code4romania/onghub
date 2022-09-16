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
import { ApplicationRequest } from './entities/application-request.entity';
import { ApplicationRequestRepository } from './repositories/application-request.repository';
import { ApplicationRequestService } from './services/application-request.service';
import { ApplicationRequestController } from './controllers/application-request.controller';
import { UserOngApplication } from './entities/user-ong-application.entity';
import { UserOngApplicationRepository } from './repositories/user-ong-application.repository';
import { UserOngApplicationService } from './services/user-ong-application.service';
import { ApplicationView } from './entities/application-view.entity';
import { ApplicationViewRepository } from './repositories/application-view.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application,
      OngApplication,
      ApplicationRequest,
      UserOngApplication,
      ApplicationView,
    ]),
    SharedModule,
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
    ApplicationViewRepository,
  ],
  exports: [
    OngApplicationService,
    ApplicationService,
    UserOngApplicationService,
  ],
})
export class ApplicationModule {}
