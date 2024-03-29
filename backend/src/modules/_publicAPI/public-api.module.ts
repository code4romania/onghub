import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CivicCenterModule } from '../civic-center-service/civic-center.module';
import { OrganizationModule } from '../organization/organization.module';
import { PracticeProgramModule } from '../practice-program/practice-program.module';
import { UserModule } from '../user/user.module';
import { CivicCenterPublicController } from './controllers/civic-center-public.controller';
import { PracticeProgramPublicController } from './controllers/practice-program-public.controller';
import { PublicAPIController } from './controllers/public-api.controller';
import { PublicKeysManager } from './public-keys-manager.service';
import { PublicKeys } from './public-keys.entity';
import { CivicCenterPublicService } from './services/civic-center-public.service';
import { PracticeProgramPublicService } from './services/practice-program-public.service';
import { UserOrganizationService } from './services/user-organization.service';

@Module({
  imports: [
    OrganizationModule,
    TypeOrmModule.forFeature([PublicKeys]),
    CivicCenterModule,
    PracticeProgramModule,
    UserModule,
  ],
  controllers: [
    PublicAPIController,
    CivicCenterPublicController,
    PracticeProgramPublicController,
  ],
  providers: [
    PublicKeysManager,
    CivicCenterPublicService,
    PracticeProgramPublicService,
    UserOrganizationService,
  ],
  exports: [],
})
export class PublicAPIModule {}
