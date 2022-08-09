import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationModule } from '../organization/organization.module';
import { UserModule } from '../user/user.module';
import { RequestsService } from './services/requests.service';
import { Request } from '../requests/entities/request.entity';
import { RequestRepository } from './repositories/request.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request]),
    OrganizationModule,
    UserModule,
  ],
  providers: [RequestsService, RequestRepository],
  exports: [RequestsService],
})
export class RequestsModule {}