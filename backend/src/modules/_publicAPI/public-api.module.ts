import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from '../application/application.module';
import { PublicApiSendMailService } from './public-api-send-mail.service';
import { PublicAPIController } from './public-api.controller';
import { PublicKeysManager } from './public-keys-manager.service';
import { PublicKeys } from './public-keys.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicKeys]), ApplicationModule],
  controllers: [PublicAPIController],
  providers: [PublicKeysManager, PublicApiSendMailService],
  exports: [],
})
export class PublicAPIModule {}
