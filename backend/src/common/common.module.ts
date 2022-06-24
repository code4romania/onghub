import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonController } from './common.controller';
import { City, County, Contact, Area, Domain } from './entities';
import { NomenclaturesService, ContactService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([City, County, Contact, Area, Domain])],
  controllers: [CommonController],
  providers: [NomenclaturesService, ContactService],
  exports: [NomenclaturesService, ContactService],
})
export class CommonModule {}
