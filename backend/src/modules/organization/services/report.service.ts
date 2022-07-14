import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Report } from '../entities';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  get(conditions: FindOneOptions<Report>) {
    return this.reportRepository.findOne(conditions);
  }

  getMany(conditions: FindManyOptions<Report>) {
    return this.reportRepository.find(conditions);
  }
}
