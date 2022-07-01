import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedController } from './controllers/shared.controller';
import { NomenclaturesController } from './controllers/nomenclatures.controller';
import { City, County, Area, Domain } from './entities';
import { NomenclaturesService } from './services';
import { ApplicationType } from './entities/application-type.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([City, County, Area, Domain, ApplicationType]),
  ],
  controllers: [SharedController, NomenclaturesController],
  providers: [NomenclaturesService],
  exports: [NomenclaturesService],
})
export class SharedModule {}
