import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City, Domain } from 'src/shared/entities';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class NomenclaturesService {
  constructor(
    @InjectRepository(City)
    private readonly citiesRepositories: Repository<City>,
    @InjectRepository(Domain)
    private readonly domainsRepositories: Repository<Domain>,
  ) {}

  public getCities(conditions: FindManyOptions<City>) {
    return this.citiesRepositories.find(conditions);
  }

  public getDomains(conditions: FindManyOptions<Domain>) {
    return this.domainsRepositories.find(conditions);
  }
}
