import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NomenclaturesController } from './controllers/nomenclatures.controller';
import { SharedController } from './controllers/shared.controller';
import { City, County, Contact, Area, Domain } from './entities';
import { NomenclaturesService, ContactService } from './services';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([City, County, Contact, Area, Domain])],
  controllers: [SharedController, NomenclaturesController],
  providers: [NomenclaturesService, ContactService],
  exports: [NomenclaturesService, ContactService],
})
export class SharedModule {}
