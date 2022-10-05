import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicAPIController } from './public-api.controller';
import { PublicKeysManager } from './public-keys-manager.service';
import { PublicKeys } from './public-keys.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PublicKeys])],
  controllers: [PublicAPIController],
  providers: [PublicKeysManager],
  exports: [],
})
export class PublicAPIModule {}
