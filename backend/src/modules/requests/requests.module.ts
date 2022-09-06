import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationModule } from '../organization/organization.module';
import { UserModule } from '../user/user.module';
import { ApplicationModule } from '../application/application.module';
import { ApplicationRequest } from './entities/application-request.entity';
import { OrganizationRequest } from './entities/organization-request.entity';
import { ApplicationRequestRepository } from './repositories/application-request.repository';
import { OrganizationRequestRepository } from './repositories/organization-request.repository';
import { ApplicationRequestController } from './controllers/application-request.controller';
import { OrganizationRequestController } from './controllers/organization-request.controller';
import { OrganizationRequestService } from './services/organization-request.service';
import { ApplicationRequestService } from './services/application-request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationRequest, OrganizationRequest]),
    OrganizationModule,
    ApplicationModule,
    UserModule,
  ],
  controllers: [ApplicationRequestController, OrganizationRequestController],
  providers: [
    ApplicationRequestRepository,
    OrganizationRequestRepository,
    OrganizationRequestService,
    ApplicationRequestService,
  ],
  exports: [ApplicationRequestService, OrganizationRequestService],
})
export class RequestsModule {}
