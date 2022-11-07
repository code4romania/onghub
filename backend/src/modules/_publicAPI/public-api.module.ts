import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from '../application/application.module';
import { CivicCenterModule } from '../civic-center-service/civic-center.module';
import { PublicAPIController } from './public-api.controller';
import { PublicKeysManager } from './public-keys-manager.service';
import { PublicKeys } from './public-keys.entity';
import { CivicCenterPublicService } from './services/civic-center-public.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicKeys]),
    ApplicationModule,
    CivicCenterModule,
  ],
  controllers: [PublicAPIController],
  providers: [PublicKeysManager, CivicCenterPublicService],
  exports: [],
})
export class PublicAPIModule {}
