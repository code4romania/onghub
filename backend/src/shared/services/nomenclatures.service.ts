import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City, County, Domain, Region } from 'src/shared/entities';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CitySearchDto } from '../dto/city-search.dto';
import { ApplicationType } from '../entities/application-type.entity';
import { Coalition } from '../entities/coalition.entity';
import { Federation } from '../entities/federation.entity';

@Injectable()
export class NomenclaturesService {
  constructor(
    @InjectRepository(City)
    private readonly citiesRepository: Repository<City>,
    @InjectRepository(County)
    private readonly countiesRepository: Repository<County>,
    @InjectRepository(Domain)
    private readonly domainsRepository: Repository<Domain>,
    @InjectRepository(ApplicationType)
    private readonly applicationTypeRepository: Repository<ApplicationType>,
    @InjectRepository(Region)
    private readonly regionsRepository: Repository<Region>,
    @InjectRepository(Federation)
    private readonly federationsRepository: Repository<Federation>,
    @InjectRepository(Coalition)
    private readonly coalitionsRepository: Repository<Coalition>,
  ) {}

  public getCities(conditions: FindManyOptions<City>) {
    return this.citiesRepository.find(conditions);
  }

  public searchCities(citySearchDto: CitySearchDto) {
    return this.citiesRepository
      .createQueryBuilder('_city')
      .innerJoinAndSelect(
        '_city.county',
        '_county',
        '_city.county_id=_county.id',
      )
      .where('_city.name ilike :name', { name: `%${citySearchDto.search}%` })
      .limit(5)
      .getMany();
  }

  public getCounties(conditions: FindManyOptions<County>) {
    return this.countiesRepository.find(conditions);
  }

  public getDomains(conditions: FindManyOptions<Domain>) {
    return this.domainsRepository.find(conditions);
  }

  public getAppType(conditions: FindOneOptions<ApplicationType>) {
    return this.applicationTypeRepository.findOne(conditions);
  }

  public getRegions(conditions: FindManyOptions<Region>) {
    return this.regionsRepository.find(conditions);
  }

  public getFederations(conditions: FindManyOptions<Federation>) {
    return this.federationsRepository.find(conditions);
  }

  public getCoalitions(conditions: FindManyOptions<Coalition>) {
    return this.coalitionsRepository.find(conditions);
  }
}
