import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Report } from '../entities';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';

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

  delete(id: number) {
    return this.reportRepository.save({
      id,
      report: '',
      numberOfVolunteers: 0,
      numberOfContractors: 0,
      status: CompletionStatus.NOT_COMPLETED,
    });
  }
}
