import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDAO } from 'src/common/base/base-dao.class';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { OngApplication } from '../entities/ong-application.entity';

@Injectable()
export class OngApplicationRepository extends BaseDAO<OngApplication> {
  constructor(
    @InjectRepository(OngApplication)
    private readonly ongApplicationRepository: Repository<OngApplication>,
  ) {
    super(ongApplicationRepository);
  }

  public getQueryBuilder(): SelectQueryBuilder<OngApplication> {
    return this.ongApplicationRepository.createQueryBuilder('ong_application');
  }
}
