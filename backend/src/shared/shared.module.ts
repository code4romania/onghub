import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedController } from './shared.controller';
import { City, County, Area, Domain } from './entities';
import { NomenclaturesService } from './services';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([City, County, Area, Domain])],
  controllers: [SharedController],
  providers: [NomenclaturesService],
  exports: [NomenclaturesService],
})
export class SharedModule {}
