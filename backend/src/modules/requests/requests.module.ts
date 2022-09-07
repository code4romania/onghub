import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationModule } from '../organization/organization.module';
import { UserModule } from '../user/user.module';
import { ApplicationModule } from '../application/application.module';
import { OrganizationRequest } from './entities/organization-request.entity';
import { OrganizationRequestRepository } from './repositories/organization-request.repository';
import { OrganizationRequestController } from './controllers/organization-request.controller';
import { OrganizationRequestService } from './services/organization-request.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationRequest]),
    OrganizationModule,
    ApplicationModule,
    UserModule,
  ],
  controllers: [OrganizationRequestController],
  providers: [OrganizationRequestRepository, OrganizationRequestService],
  exports: [OrganizationRequestService],
})
export class RequestsModule {}
