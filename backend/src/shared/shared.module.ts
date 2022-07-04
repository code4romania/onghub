import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedController } from './controllers/shared.controller';
import { NomenclaturesController } from './controllers/nomenclatures.controller';
import { City, County, Area, Domain } from './entities';
import { AnafService, NomenclaturesService } from './services';
import { ApplicationType } from './entities/application-type.entity';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([City, County, Area, Domain, ApplicationType]),
    HttpModule,
  ],
  controllers: [SharedController, NomenclaturesController],
  providers: [NomenclaturesService, AnafService],
  exports: [NomenclaturesService],
})
export class SharedModule {}
