import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationModule } from '../organization/organization.module';
import { UserModule } from '../user/user.module';
import { RequestsService } from './services/requests.service';
import { Request } from '../requests/entities/request.entity';
import { RequestRepository } from './repositories/request.repository';
import { RequestsController } from './requests.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request]),
    OrganizationModule,
    ApplicationModule,
    UserModule,
  ],
  controllers: [RequestsController],
  providers: [RequestsService, RequestRepository],
  exports: [RequestsService],
})
export class RequestsModule {}
