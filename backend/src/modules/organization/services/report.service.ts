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

  update(id: number, data: Partial<Report>) {
    return this.reportRepository.save({
      id,
      ...data,
    });
  }

  delete(id: number) {
    return this.reportRepository.save({
      id,
      report: null,
      numberOfVolunteers: null,
      numberOfContractors: null,
      status: CompletionStatus.NOT_COMPLETED,
    });
  }
}
