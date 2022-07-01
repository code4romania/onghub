import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City, Domain } from 'src/shared/entities';
import { FindManyOptions, Repository, FindOneOptions } from 'typeorm';
import { ApplicationType } from '../entities/application-type.entity';

@Injectable()
export class NomenclaturesService {
  constructor(
    @InjectRepository(City)
    private readonly citiesRepositories: Repository<City>,
    @InjectRepository(Domain)
    private readonly domainsRepositories: Repository<Domain>,
    @InjectRepository(ApplicationType)
    private readonly applicationTypeRepository: Repository<ApplicationType>,
  ) {}

  public getCities(conditions: FindManyOptions<City>) {
    return this.citiesRepositories.find(conditions);
  }

  public getDomains(conditions: FindManyOptions<Domain>) {
    return this.domainsRepositories.find(conditions);
  }

  public getAppType(conditions: FindOneOptions<ApplicationType>) {
    return this.applicationTypeRepository.find(conditions);
  }
}
