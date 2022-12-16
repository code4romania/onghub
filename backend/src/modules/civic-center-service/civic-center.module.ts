import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from '../application/application.module';
import { CivicCenterController } from './controllers/civic-center.controller';
import { FeedbackController } from './controllers/feedback.controller';
import { CivicCenterService } from './entities/civic-center-service.entity';
import { CivicCenterFeedback } from './entities/civic-center-feedback.entity';
import { CivicCenterServiceRepository } from './repositories/civic-center-service.repository';
import { CivicCenterFeedbackRepository } from './repositories/civic-center-feedback.repository';
import { CivicCenterServiceService } from './services/civic-center.service';
import { CivicCenterFeedbackService } from './services/civic-center-feedback.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CivicCenterService, CivicCenterFeedback]),
    ApplicationModule,
  ],
  controllers: [CivicCenterController, FeedbackController],
  providers: [
    CivicCenterServiceRepository,
    CivicCenterFeedbackRepository,
    CivicCenterServiceService,
    CivicCenterFeedbackService,
  ],
  exports: [CivicCenterServiceService, CivicCenterFeedbackService],
})
export class CivicCenterModule {}
