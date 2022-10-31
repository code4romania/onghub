import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CivicCenterServiceController } from '../civic-center-service/controllers/civic-center-service.controller';
import { CivicCenterService } from '../civic-center-service/entities/civic-center-service.entity';
import { CivicCenterServiceRepository } from '../civic-center-service/repositories/civic-center-service.repository';
import { CivicCenterServiceService } from '../civic-center-service/services/civic-center-service.service';

@Module({
  imports: [TypeOrmModule.forFeature([CivicCenterService])],
  controllers: [CivicCenterServiceController],
  providers: [CivicCenterServiceRepository, CivicCenterServiceService],
  exports: [CivicCenterService],
})
export class CivicCenterServiceModule {}
