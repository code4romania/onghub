import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from '../application/application.module';
import { PracticeProgramController } from './controllers/practice-program.controller';
import { PracticeProgram } from './entities/practice-program.entity';
import { PracticeProgramRepository } from './repositories/practice-program.repository';
import { PracticeProgramService } from './services/practice-program.service';

@Module({
  imports: [TypeOrmModule.forFeature([PracticeProgram]), ApplicationModule],
  controllers: [PracticeProgramController],
  providers: [PracticeProgramRepository, PracticeProgramService],
  exports: [PracticeProgramService],
})
export class PracticeProgramModule {}
