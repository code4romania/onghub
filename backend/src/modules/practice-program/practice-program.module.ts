import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeProgram } from './entities/practice-program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PracticeProgram])],
  controllers: [],
  providers: [],
})
export class PracticeProgramModule {}
