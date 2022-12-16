import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { CivicCenterFeedback } from '../entities/civic-center-feedback.entity';

@Injectable()
export class CivicCenterFeedbackRepository extends BaseDAO<CivicCenterFeedback> {
  constructor(
    @InjectRepository(CivicCenterFeedback)
    private readonly civicCenterServiceRepository: Repository<CivicCenterFeedback>,
  ) {
    super(civicCenterServiceRepository);
  }
}
