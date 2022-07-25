import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Investor } from '../entities';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';

@Injectable()
export class InvestorService {
  constructor(
    @InjectRepository(Investor)
    private readonly investorRepository: Repository<Investor>,
  ) {}

  get(conditions: FindOneOptions<Investor>) {
    return this.investorRepository.findOne(conditions);
  }

  getMany(conditions: FindManyOptions<Investor>) {
    return this.investorRepository.find(conditions);
  }

  update(id: number, data: Partial<Investor>) {
    return this.investorRepository.save({
      id,
      ...data,
    });
  }

  delete(id: number) {
    return this.investorRepository.save({
      id,
      numberOfInvestors: null,
      status: CompletionStatus.NOT_COMPLETED,
    });
  }
}
