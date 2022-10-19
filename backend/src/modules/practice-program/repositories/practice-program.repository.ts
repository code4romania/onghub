import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { PracticeProgram } from '../entities/practice-program.entity';

@Injectable()
export class PracticeProgramRepository extends BaseDAO<PracticeProgram> {
  constructor(
    @InjectRepository(PracticeProgram)
    private readonly practiceProgramRepository: Repository<PracticeProgram>,
  ) {
    super(practiceProgramRepository);
  }
}
