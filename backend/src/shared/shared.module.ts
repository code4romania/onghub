import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedController } from './controllers/shared.controller';
import { NomenclaturesController } from './controllers/nomenclatures.controller';
import {
  City,
  Coalition,
  County,
  Domain,
  Faculty,
  Federation,
  Region,
  Skill,
} from './entities';
import { AnafService, NomenclaturesService } from './services';
import { HttpModule } from '@nestjs/axios';
import { S3FileManagerService } from './services/s3-file-manager.service';
import { FileManagerService } from './services/file-manager.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      City,
      County,
      Domain,
      Region,
      Federation,
      Coalition,
      Faculty,
      Skill,
    ]),
    HttpModule,
  ],
  controllers: [SharedController, NomenclaturesController],
  providers: [
    NomenclaturesService,
    AnafService,
    S3FileManagerService,
    FileManagerService,
  ],
  exports: [
    NomenclaturesService,
    AnafService,
    S3FileManagerService,
    FileManagerService,
  ],
})
export class SharedModule {}
