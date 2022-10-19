import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository } from 'typeorm';
import { CivicCenterService } from '../entities/civic-center-service.entity';

@Injectable()
export class CivicCenterServiceRepository extends BaseDAO<CivicCenterService> {
  constructor(
    @InjectRepository(CivicCenterService)
    private readonly civicCenterServiceRepository: Repository<CivicCenterService>,
  ) {
    super(civicCenterServiceRepository);
  }
}
