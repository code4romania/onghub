import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { Feedback } from '../entities/feedback.entity';

@Injectable()
export class FeedbackRepository extends BaseDAO<Feedback> {
  constructor(
    @InjectRepository(Feedback)
    private readonly civicCenterServiceRepository: Repository<Feedback>,
  ) {
    super(civicCenterServiceRepository);
  }
}
