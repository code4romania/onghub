import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from '../application/application.module';
import { CivicCenterController } from './controllers/civic-center.controller';
import { FeedbackController } from './controllers/feedback.controller';
import { CivicCenterService } from './entities/civic-center-service.entity';
import { Feedback } from './entities/feedback.entity';
import { CivicCenterServiceRepository } from './repositories/civic-center-service.repository';
import { FeedbackRepository } from './repositories/feedback.repository';
import { CivicCenterServiceService } from './services/civic-center.service';
import { FeedbackService } from './services/feedback.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CivicCenterService, Feedback]),
    ApplicationModule,
  ],
  controllers: [CivicCenterController, FeedbackController],
  providers: [
    CivicCenterServiceRepository,
    FeedbackRepository,
    CivicCenterServiceService,
    FeedbackService,
  ],
  exports: [CivicCenterServiceService],
})
export class CivicCenterModule {}
