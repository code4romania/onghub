import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Partner } from '../entities';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
  ) {}

  get(conditions: FindOneOptions<Partner>) {
    return this.partnerRepository.findOne(conditions);
  }

  getMany(conditions: FindManyOptions<Partner>) {
    return this.partnerRepository.find(conditions);
  }
}
