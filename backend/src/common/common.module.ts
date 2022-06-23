import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonController } from './common.controller';
import { City, County, Contact, Area, Domain } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([City, County, Contact, Area, Domain])],
  controllers: [CommonController],
})
export class CommonModule {}
