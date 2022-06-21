import { Module } from '@nestjs/common';
import { OrganizationService } from './services/organization.service';
import { OrganizationController } from './organization.controller';
import { OrganizationRepository } from './repositories/organization.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { CommonModule } from 'src/common/common.module';
import { OrganizationGeneral } from './entities/organization-general.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, OrganizationGeneral]),
    CommonModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationRepository],
})
export class OrganizationModule {}
