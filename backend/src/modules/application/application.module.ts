import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationController } from './application.controller';
import { ApplicationType } from './entities/application-type.entity';
import { Application } from './entities/application.entity';
import { ApplicationRepository } from './repositories/application.repository';
import { ApplicationTypeService } from './services/application-type.service';
import { ApplicationService } from './services/application.service';

@Module({
  imports: [TypeOrmModule.forFeature([Application, ApplicationType])],
  controllers: [ApplicationController],
  providers: [
    ApplicationService,
    ApplicationRepository,
    ApplicationTypeService,
  ],
})
export class ApplicationModule {}
