import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedController } from './shared.controller';
import { City, County, Contact, Area, Domain } from './entities';
import { NomenclaturesService, ContactService } from './services';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([City, County, Contact, Area, Domain])],
  controllers: [SharedController],
  providers: [NomenclaturesService, ContactService],
  exports: [NomenclaturesService, ContactService],
})
export class SharedModule {}
