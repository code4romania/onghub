import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CivicCenterServiceController } from './controllers/civic-center-service.controller';
import { FeedbackController } from './controllers/feedback.controller';
import { CivicCenterService } from './entities/civic-center-service.entity';
import { Feedback } from './entities/feedback.entity';
import { CivicCenterServiceRepository } from './repositories/civic-center-service.repository';
import { FeedbackRepository } from './repositories/feedback.repository';
import { CivicCenterServiceService } from './services/civic-center-service.service';
import { FeedbackService } from './services/feedback.service';

@Module({
  imports: [TypeOrmModule.forFeature([CivicCenterService, Feedback])],
  controllers: [CivicCenterServiceController, FeedbackController],
  providers: [
    CivicCenterServiceRepository,
    FeedbackRepository,
    CivicCenterServiceService,
    FeedbackService,
  ],
})
export class CivicCenterServiceModule {}
