import { Module } from '@nestjs/common';
import { OrganizationService } from './services/organization.service';
import { OrganizationController } from './organization.controller';
import { OrganizationRepository } from './repositories/organization.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationRepository],
})
export class OrganizationModule {}
