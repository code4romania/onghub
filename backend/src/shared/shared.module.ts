import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedController } from './controllers/shared.controller';
import { NomenclaturesController } from './controllers/nomenclatures.controller';
import { City, County, Domain } from './entities';
import { AnafService, NomenclaturesService } from './services';
import { ApplicationType } from './entities/application-type.entity';
import { HttpModule } from '@nestjs/axios';
import { Region } from './entities/region.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([City, County, Domain, ApplicationType, Region]),
    HttpModule,
  ],
  controllers: [SharedController, NomenclaturesController],
  providers: [NomenclaturesService, AnafService],
  exports: [NomenclaturesService, AnafService],
})
export class SharedModule {}
