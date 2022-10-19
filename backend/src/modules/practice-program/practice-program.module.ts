import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeProgramController } from './controllers/practice-program.controller';
import { PracticeProgram } from './entities/practice-program.entity';
import { PracticeProgramRepository } from './repositories/practice-program.repository';
import { PracticeProgramService } from './services/practice-program.service';

@Module({
  imports: [TypeOrmModule.forFeature([PracticeProgram])],
  controllers: [PracticeProgramController],
  providers: [PracticeProgramRepository, PracticeProgramService],
})
export class PracticeProgramModule {}
