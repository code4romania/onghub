import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CivicCenterServiceController } from './controllers/civic-center-service.controller';
import { PracticeProgramController } from './controllers/practice-program.controller';
import { CivicCenterService } from './entities/civic-center-service.entity';
import { PracticeProgram } from './entities/practice-program.entity';
import { CivicCenterServiceRepository } from './repositories/civic-center-service.repository';
import { PracticeProgramRepository } from './repositories/practice-program.repository';
import { CivicCenterServiceService } from './services/civic-center-service.service';
import { PracticeProgramService } from './services/practice-program.service';

@Module({
  imports: [TypeOrmModule.forFeature([PracticeProgram, CivicCenterService])],
  controllers: [PracticeProgramController, CivicCenterServiceController],
  providers: [
    PracticeProgramRepository,
    CivicCenterServiceRepository,
    PracticeProgramService,
    CivicCenterServiceService,
  ],
})
export class PracticeProgramModule {}
