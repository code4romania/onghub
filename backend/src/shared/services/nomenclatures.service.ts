import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  City,
  County,
  Domain,
  Faculty,
  Region,
  Skill,
} from 'src/shared/entities';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CitySearchDto } from '../dto/city-search.dto';
import { NOMENCLATURE_ERRORS } from '../constants/nomenclature-error.constants';
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
    @InjectRepository(Region)
    private readonly regionsRepository: Repository<Region>,
    @InjectRepository(Federation)
    private readonly federationsRepository: Repository<Federation>,
    @InjectRepository(Coalition)
    private readonly coalitionsRepository: Repository<Coalition>,
    @InjectRepository(Faculty)
    private readonly facultiesRepository: Repository<Faculty>,
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
  ) {}

  public getCity(conditions: FindOneOptions<City>) {
    return this.citiesRepository.findOne(conditions);
  }

  public getCities(conditions: FindManyOptions<City>) {
    return this.citiesRepository.find(conditions);
  }

  public getCitiesSearch(citySearchDto: CitySearchDto) {
    if (citySearchDto.cityId) {
      return this.citiesRepository.find({
        where: { id: citySearchDto.cityId },
        relations: ['county'],
      });
    }

    if (
      citySearchDto.countyId === undefined &&
      citySearchDto.search === undefined
    ) {
      throw new NotAcceptableException({
        ...NOMENCLATURE_ERRORS.CITY_QUERY,
      });
    }

    const query = this.citiesRepository
      .createQueryBuilder('_city')
      .innerJoinAndSelect(
        '_city.county',
        '_county',
        '_city.county_id=_county.id',
      );

    if (citySearchDto.search && citySearchDto.countyId) {
      return query
        .where('_city.county_id = :county', {
          county: citySearchDto.countyId,
        })
        .andWhere('_city.name ilike :name', {
          name: `${citySearchDto.search}%`,
        })
        .limit(5)
        .getMany();
    } else if (citySearchDto.countyId) {
      return query
        .where('_city.county_id = :county', {
          county: citySearchDto.countyId,
        })
        .getMany();
    } else {
      return query
        .where('_city.name ilike :name', {
          name: `${citySearchDto.search}%`,
        })
        .limit(5)
        .getMany();
    }
  }

  public getCounties(conditions: FindManyOptions<County>) {
    return this.countiesRepository.find(conditions);
  }

  public getDomains(conditions: FindManyOptions<Domain>) {
    return this.domainsRepository.find(conditions);
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

  public getFaculties(conditions: FindManyOptions<Faculty>) {
    return this.facultiesRepository.find(conditions);
  }

  public getSkills(conditions: FindManyOptions<Skill>) {
    return this.skillsRepository.find(conditions);
  }

  public createSkills(skills: Partial<Skill>[]): Promise<Skill[]> {
    return this.skillsRepository.save(skills);
  }
}
